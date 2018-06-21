<template>
  <modal name="learning-nodes.content" class="objectiveModal" @before-open="beforeOpen"
    :scrollable="true" width="80%">
    <h4 class="text-center mb-4">New Content</h4>
    <form @submit.prevent="validateBeforeSubmit">
      <div class="form-group">
        <label>Title <abbr title="Required">*</abbr></label>
        <input type="text" class="form-control" v-model="block.title" v-validate="'required'" name="title">
        <div class="invalid-feedback" v-if="errors.has('title')" style="display: block;">
          {{ errors.first('title') }}
        </div>
      </div>
      <div class="form-group">
        <label>Text to Speak <abbr title="Required">*</abbr></label>
        <quill-editor v-model="block.content" :options="editorOptions"></quill-editor>
        <input type="hidden" name="content" v-validate="'required'" v-model="block.content">
        <div class="invalid-feedback" v-if="errors.has('content')" style="display: block;">
          {{ errors.first('content') }}
        </div>
      </div>
      <h5>Instructions</h5>
      <div class="form-group">
        <input type="text" class="form-control" v-model="block.instructions.audio" v-validate="'url'" name="audio"
          placeholder="Audio URL">
        <div class="invalid-feedback" v-if="errors.has('audio')" style="display: block;">
          {{ errors.first('audio') }}
        </div>
      </div>
      <h5>Other options</h5>
      <div class="form-group">
        <label>
          <input type="checkbox" v-model="block.options.automatic_next">
          Automatic next
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

  export default {
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
        node: {
          options: {},
          type: 'lesson',
          description: {
          }
        },
        block: {
          type: 'Content',
          title: '',
          content: '',
          instructions: {},
          options: {}
        }
      }
    },
    mounted() {
    },
    methods: {
      beforeOpen(event) {
        Object.assign(this.node, event.params.node)
        this.block = this.$options.data().block
        if (event.params.block) {
          this.block = JSON.parse(JSON.stringify(event.params.block))
          this.isNewObject = false
        }
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
            this.$modal.hide('learning-nodes.content')
            this.$flash.notify('success', "Block has been added successfully")
            this.$emit('added-block', res.data)
          })
          .catch((err) => {
            this.loading = false
          })
      },
      close() {
        this.$modal.hide('learning-nodes.content');
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
