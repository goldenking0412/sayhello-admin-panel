<template>
  <modal name="learning-nodes.web-page" class="objectiveModal" @before-open="beforeOpen"
    :scrollable="true" width="50%">
    <h4 class="text-center mb-4">New WebPage</h4>
    <form @submit.prevent="validateBeforeSubmit">
      <div class="form-group">
        <label>Title</label>
        <input type="text" class="form-control" v-model="block.title" name="title">
      </div>
      <div class="form-group">
        <label>URL <abbr title="Required">*</abbr></label>
        <input type="text" class="form-control" name="url" v-validate="'url'" v-model="block.url">
      </div>
      <div class="form-group">
        <label>Learning Objectives</label>
        <v-select multiple v-model="learningObjectives" label="title" :value="'id'" :options="learningObjectiveOptions"></v-select>
      </div>
      <br/>
      <h5>Instructions</h5>
      <div class="form-group">
        <input type="text" class="form-control" v-model="block.instructions.audio" v-validate="'url'" name="audio"
          placeholder="Audio URL">
        <div class="invalid-feedback" v-if="errors.has('audio')" style="display: block;">
          {{ errors.first('audio') }}
        </div>
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
  import LearningObjectiveMixin from './learning-objective-mixin'

  export default {
    mixins: [LearningObjectiveMixin],
    components: {
      Loading
    },
    data() {
      return {
        characters: [],
        note: '',
        loading: false,
        isNewObject: true,
        editorOptions: {
          modules: {
          }
        },
        learningObjectives: [],
        node: {
          options: {},
          type: 'lesson',
          description: {
          }
        },
        block: {
          type: 'WebPage',
          title: '',
          url: '',
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
            this.addBlock()
            return
          }
        });
      },
      addBlock() {
        this.loading = true

        let blocks = this.node.blocks
        this.block.learning_objectives = this.learningObjectives.map(obj => obj.id)
        this.block.evaluatable_objectives = null

        if (this.isNewObject) {
          blocks.push(this.block)  
        } else {
          for (const [index, block] of blocks.entries()) {
            if (block.id == this.block.id) {
              blocks[index] = this.block
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
            this.$modal.hide('learning-nodes.web-page')
            this.$flash.notify('success', "Block has been added successfully")
            this.$emit('added-block', res.data)
          })
          .catch((err) => {
            this.loading = false
          })
      },
      close() {
        this.$modal.hide('learning-nodes.web-page');
      }
    }
  }
</script>

<style>
  .objectiveModal .v--modal {
    top: 50px !important
  }
  .ql-container.ql-snow {
    height: 200px;
  }
</style>
