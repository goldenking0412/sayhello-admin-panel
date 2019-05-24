
<template>
  <modal name="learning-nodes.mcqsummarysimple-dialogue" class="objectiveModal" @before-open="beforeOpen"
    :scrollable="true">
    <h4 class="mb-4">MCQ Summary Simple</h4>
    <form @submit.prevent="validateBeforeSubmit">
      <h5>Good</h5>
      <div class="form-group">
        <strong>Score</strong>
        <input type="text" class="form-control" v-model="block.good_score" name="good_score">
      </div>
      <div class="form-group">
        <strong>Explanation</strong>
        <textarea type="textarea" class="form-control" v-model="block.good_explanation" name="good_explanation"></textarea>
      </div>
      <h5>Good</h5>
      <div class="form-group">
        <strong>Score</strong>
        <input type="text" class="form-control" v-model="block.bad_score" name="bad_score">
      </div>
      <div class="form-group">
        <strong>Explanation</strong>
        <textarea type="textarea" class="form-control" v-model="block.bad_explanation" name="bad_explanation"></textarea>
      </div>

      <div class="form-group">
        <div class="text-right">
          <button class="btn btn-default btn-md ml-2">{{ isNewObject ? 'Add' : 'Update' }}</button>
        </div>
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
        loading: false,
        isNewObject: true,
        node: {
          options: {},
          type: 'lesson',
          description: {
          }
        },
        block: {
          type: 'MCQSummarySimple',
          good_score: '',
          good_explanation: '',
          bad_score: '',
          bad_explanation: '',
          title: 'MCQ Summary Simple'
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

        let newBlock = {}
        Object.assign(newBlock, this.block)

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
            this.$modal.hide('learning-nodes.mcqsummarysimple-dialogue')
            this.$flash.notify('success', "Block has been added successfully")
            this.$emit('added-block', res.data)
            
          })
          .catch((err) => {
            this.loading = false
            alert(err)
          })
      }
    }
  }
</script>

<style scoped>
  .objectiveModal .v--modal {
    top: 50px !important
  }
</style>
