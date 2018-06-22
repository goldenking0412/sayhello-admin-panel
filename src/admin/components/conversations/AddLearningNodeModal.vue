<template>
  <modal name="learning-nodes.create" class="objectiveModal" @before-open="beforeOpen"
    :scrollable="true">
    <h4 class="text-center mb-4">{{ isNewObject ? 'Create' : 'Update' }} Learning Node</h4>
    <form @submit.prevent="validateBeforeSubmit">
      <div class="row mb-2">
        <div class="col-4">
          <label>Name <abbr title="Required">*</abbr></label>
        </div>
        <div class="col-8">
          <input type="text" class="form-control" v-model="node.title" v-validate="'required'" name="title">
          <div class="invalid-feedback" v-if="errors.has('title')" style="display: block;">
            {{ errors.first('title') }}
          </div>
        </div>
      </div>
      <div class="row mb-2">
        <div class="col-4">
          <label>Description</label>
        </div>
        <div class="col-8">
          <textarea rows="4" class="form-control" v-model="node.description.en" name="description"
            v-validate="'required'"></textarea>
          <div class="invalid-feedback" v-if="errors.has('description')"  style="display: block;">
            {{ errors.first('description') }}
          </div>
        </div>
      </div>
      <div class="row mb-2">
        <div class="col-4">
          Est. Duration <abbr title="Required">*</abbr>
        </div>
        <div class="col-8">
          <div class="row">
            <div class="col-6">
              <input type="number" v-validate="'required'" name="duration" class="form-control" v-model="node.duration">
            </div>
            <div class="col-6">
              <div class="mt-2">Mins</div>
            </div>
          </div>
          <div class="invalid-feedback" v-if="errors.has('duration')"  style="display: block;">
            {{ errors.first('duration') }}
          </div>
        </div>
      </div>
      <div class="row mb-2">
        <div class="col-4">
          Image <abbr title="Required">*</abbr>
        </div>
        <div class="col-8">
          <input type="file" class="form-control" ref="imageFile" v-validate="imageValidate" name="image" accept="image/*">
          <div class="invalid-feedback" v-if="errors.has('image')" style="display: block;">
            {{ errors.first('image') }}
          </div>
        </div>
      </div>
      <div class="row mb-2">
        <div class="col-4">
          Preffered System Voice<abbr title="Required">*</abbr>
        </div>
        <div class="col-8">
          <select name="character" v-validate="'required'" class="form-control" v-model="node.options.preffered_character">
            <option value="">-- Select --</option>
            <option :value="name" v-for="(name, index) in characters" :key="index">{{ name }}</option>
          </select>
          <div class="invalid-feedback" v-if="errors.has('character')" style="display: block;">
            {{ errors.first('character') }}
          </div>
        </div>
      </div>
      <div class="form-group">
        <div class="row">
          <div class="col-4">
            Tags
          </div>
          <div class="col-8">
            <vue-tags-input
              v-model="tag"
              :tags="tags"
              placeholder="Add Word"
              @tags-changed="newTags => tags = newTags"
              :autocomplete-items="getAutocompleteTags(tag)"
            />
          </div>
        </div>
      </div>
      <div class="mb-2 mt-2">
        <label class="mr-3">
          <input type="checkbox" v-model="node.options.capture_difficulty_level" value="">
          Capture difficulty level
        </label>
        <label class="mr-3">
          <input type="checkbox" v-model="node.options.replay_enabled">
          Student can replay
        </label>
        <label class="mr-3">
          <input type="checkbox" v-model="node.options.evaluation_enabled">
          Evaluation enabled
        </label>
        <label class="mr-3">
          <input type="checkbox" v-model="node.options.enable_retake">
          Student can re-take
        </label>
        <label class="mr-3">
          <input type="checkbox" v-model="node.options.need_student_responses">
          Student has to respond
        </label>
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
  import VueTagsInput from '@johmun/vue-tags-input';
  import TagsAucompleteMixin from '../../../mixins/tags-autocomplete'

  export default {
    mixins: [TagsAucompleteMixin],
    components: {
      Loading, VueTagsInput
    },
    data() {
      return {
        imageValidate: 'required',
        characters: [],
        note: '',
        loading: false,
        isNewObject: true,
        tag: '',
        tags: [],
        node: {
          options: {},
          type: 'lesson',
          description: {
          },
          tags: []
        }
      }
    },
    mounted() {
    },
    methods: {
      beforeOpen(event) {
        if (event.params) {
          this.isNewObject = false
          this.node = JSON.parse(JSON.stringify(event.params))
          if (this.node.tags) {
            this.tags = this.node.tags.map(tag => { return {text: tag, tiClasses: ['valid']} })
          }
          if (!this.node.description) {
            this.node.description = {}
          }
        } else {
          Object.assign(this.$data, this.$options.data())
        }

        if (this.node.image) {
          this.imageValidate = ''
        }

        this.loadCharacters()
      },
      validateBeforeSubmit() {
        this.$validator.validateAll().then((result) => {
          if (result) {
            if(this.$refs.imageFile.files.length) {
              this.uploadImage()
            }else {
              this.createNode()
            }

            return
          }
        });
      },
      uploadImage() {
        let uploadProcess = uploadcare.fileFrom('object', this.$refs.imageFile.files[0]);
        this.loading = true

        uploadProcess.done((fileInfo) => {
          this.node.image = fileInfo.cdnUrl + fileInfo.name
          this.createNode()
        }).fail((error, fileInfo) => {
          this.loading = false
          this.$flash.notify('warning', "Can't upload image. Please try again")
        });
      },
      createNode() {
        this.loading = true
        this.node.tags = this.tags.map(tag => tag.text)
        let apiURL = this.isNewObject ? '/v5/admin/learning_nodes' : '/v5/admin/learning_nodes/' + this.node.id
        let params = {learning_node: this.node, learning_objectives: [] }
        let successMessage = 'Node has been created successfully'

        if (!this.isNewObject) {
          params = this.node
          successMessage = 'Node has been updated successfully'
        }

        this.axios.post(apiURL, params)
          .then((res) => {
            this.loading = false
            this.$modal.hide('learning-nodes.create')
            this.$flash.notify('success', successMessage)
            this.isNewObject ? this.$emit('created-learning-node') : this.$emit('updated-node', res.data)
          })
          .catch((err) => {
            this.loading = false
          })
      },
      loadCharacters() {
        this.axios.get('/v5/admin/common/available_characters')
          .then((res) => {
            this.characters = res.data
          })
          .catch((err) => {

          })
      },
      close() {
        this.$modal.hide('learning-nodes.create');
      }
    }
  }
</script>

<style>
  .objectiveModal .v--modal {
    top: 50px !important
  }
</style>
