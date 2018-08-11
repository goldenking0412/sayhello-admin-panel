<template>
  <modal name="learning-nodes.user-dialogue" class="objectiveModal" @before-open="beforeOpen"
    :scrollable="true">
    <h4 class="text-center mb-4">New User Dialogue</h4>
    <p>Available merge fields: {name} {date} {time} {greetings_time}</p>
    <form @submit.prevent="validateBeforeSubmit">
      <strong>Fully guided</strong>
      <div class="form-group">
        <label>Text to Speak</label>
        <input type="text" class="form-control" v-model="block.en.text" name="text">
      </div>
      <div class="form-group">
        <label>Sinhala Meaning</label>
        <input type="text" class="form-control" v-model="block.sin.text" name="meaning">
      </div>
      <strong>Words for blanks</strong>
      <div class="form-group">
        <vue-tags-input
            v-model="tag"
            :tags="tags"
            placeholder="Add Word"
            @tags-changed="newTags => tags = newTags"
          />
      </div>
      <strong>Sample response</strong>
      <div class="form-group">
        <input type="text" class="form-control" v-model="block.sample_response.audio" v-validate="'url'" name="audio"
          placeholder="Audio URL">
        <div class="invalid-feedback" v-if="errors.has('audio')" style="display: block;">
          {{ errors.first('audio') }}
        </div>
      </div>
      <div class="form-group">
        <label>
          <input type="checkbox" v-model="block.sample_response.autoplay">
          Autoplay
        </label>
      </div>
      <strong>Instructions</strong>
      <div class="form-group">
        <input type="text" class="form-control" v-model="block.instructions.audio" v-validate="'url'" name="audio"
          placeholder="Audio URL">
        <div class="invalid-feedback" v-if="errors.has('audio')" style="display: block;">
          {{ errors.first('audio') }}
        </div>
      </div>
      <div class="form-group">
        <label>Image</label>
        <input type="file" class="form-control" ref="imageFile" name="image" accept="image/*">
        <br>
        <div v-if="!$lodash.isEmpty(block.image)" style="width:150px;">
            <img :src="block.image" class="img-fluid" alt=""><br>
            <a href="#" class="btn btn-sm btn-danger" @click="block.image = ''">Remove</a>
        </div>
      </div>
      <strong>Other options</strong>
      <div class="form-group">
        <label>
          <input type="checkbox" v-model="block.options.automatic_next">
          Automatic next
        </label>
      </div>
      <div class="row">
        <div class="col-6 form-group">
          <input type="text" class="form-control" v-model="block.options.min_speak_time" v-validate="'numeric'" name="min_time"
            placeholder="Min speak time">
          <div class="invalid-feedback" v-if="errors.has('min_time')" style="display: block;">
            {{ errors.first('min_time') }}
          </div>
        </div>
        <div class="col-6 form-group">
          <input type="text" class="form-control" v-model="block.options.max_speak_time" v-validate="'numeric'" name="max_time"
            placeholder="Max speak time">
          <div class="invalid-feedback" v-if="errors.has('max_time')" style="display: block;">
            {{ errors.first('max_time') }}
          </div>
        </div>
      </div>
       <div class="form-group">
        <label>Learning Objectives</label>
        <v-select multiple v-model="learningObjectives" label="title" :value="'id'" :options="learningObjectiveOptions"></v-select>
      </div>
      <div class="text-right">
        <button class="btn btn-default btn-md" @click.prevent="close()">Close</button>
        <button class="btn btn-success btn-md ml-2">
          {{ isNewObject ? 'Create' : 'Update' }}
        </button>
      </div>
    </form>
    <Loading v-if="loading"/>
  </modal>
</template>

<script>
  import Loading from '../../../commons/Loading.vue'
  import VueTagsInput from '@johmun/vue-tags-input'
  import LearningObjectiveMixin from './learning-objective-mixin'

  export default {
    mixins: [LearningObjectiveMixin],
    components: {
      Loading, VueTagsInput
    },
    data() {
      return {
        characters: [],
        loading: false,
        isNewObject: true,
        tag: '',
        tags: [],
        node: {
          options: {},
          type: 'lesson',
          description: {
          }
        },
        block: {
          type: 'UserDialogue',
          character: {},
          en: {},
          sin: {},
          sample_response: {},
          instructions: {},
          options: {},
          evaluatable_objectives: []
        }
      }
    },
    mounted() {
    },
    methods: {
      beforeOpen(event) {
        this.isNewObject = true
        Object.assign(this.node, event.params.node)
        this.block = this.$options.data().block
        if (event.params.block) {
          this.block = JSON.parse(JSON.stringify(event.params.block))
          this.tags = this.block.fill_words.map(tag => { return {text: tag}})
          this.isNewObject = false
        }

        if (this.block.evaluatable_objectives) {
          this.learningObjectives = this.block.evaluatable_objectives.map(item => item.objective_id)
        }

        this.loadLearningObjectives()
      },
      validateBeforeSubmit() {
        this.$validator.validateAll().then((result) => {
          if (result) {
            if (this.$refs.imageFile.files.length) {
              this.uploadImage()
            } else {
              this.addBlock()
            }

            return
          }
        });
      },
      uploadImage() {
        let uploadProcess = uploadcare.fileFrom('object', this.$refs.imageFile.files[0]);
        this.loading = true

        uploadProcess.done((fileInfo) => {
          this.block.image = fileInfo.cdnUrl + fileInfo.name
          this.addBlock()
        }).fail((error, fileInfo) => {
          this.loading = false
          this.$flash.notify('warning', "Can't upload image. Please try again")
        });
      },
      addBlock() {
        this.loading = true

        let blocks = this.node.blocks
        let newBlock = {}
        Object.assign(newBlock, this.block)
        newBlock.fill_words = this.tags.map(tag => tag.text)

        newBlock.learning_objectives = this.learningObjectives.map(obj => obj.id)
        newBlock.evaluatable_objectives = null

        if (this.isNewObject) {
          blocks.push(newBlock)  
        } else {
          for (const [index, block] of blocks.entries()) {
            if (block.id == this.block.id) {
              blocks[index] = newBlock
              break
            }
          }
        }

        for (let block of blocks) {
          block._id = null
        }

        this.axios.post('/v5/admin/learning_nodes/' + this.node.id + '/blocks', {blocks: blocks})
          .then((res) => {
            this.loading = false
            this.$modal.hide('learning-nodes.user-dialogue')
            this.$flash.notify('success', "Block has been added successfully")
            this.$emit('added-block', res.data)
          })
          .catch((err) => {
            this.loading = false
          })
      },
      close() {
        this.$modal.hide('learning-nodes.user-dialogue');
      }
    }
  }
</script>

<style>
  .objectiveModal .v--modal {
    top: 50px !important
  }
</style>
