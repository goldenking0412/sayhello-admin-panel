
<template>
  <modal name="learning-nodes.simplemcq-dialogue" class="objectiveModal" @before-open="beforeOpen"
    :scrollable="true">
    <h4 class="mb-4">Simple MCQ Dialogue</h4>
    <form @submit.prevent="validateBeforeSubmit">
      <div class="form-group">
        <strong>Question</strong>
        <vue-ckeditor v-model="block.question.en" :config="editorOptions"/>
      </div>
      <div class="form-group">
        <strong>Instruction audio</strong>
        <input type="text" class="form-control" v-model="block.instructions.audio" v-validate="'url'" name="audio"
          placeholder="Audio URL">
        <div class="invalid-feedback" v-if="errors.has('audio')" style="display: block;">
          {{ errors.first('audio') }}
        </div>
      </div>
      <div class="form-group">
        <label>
          <input type="checkbox" v-model="block.options.automatic_next">
          Automatic next
        </label>
      </div>
      <div class="form-group">
        <strong>Learning Objectives</strong>
        <v-select multiple v-model="learningObjectives" label="title" :value="'id'" :options="learningObjectiveOptions"></v-select>
      </div>
      <div class="form-group">
        <strong>When in-correct answer is given</strong>
        <br>
        <div>
          <input type="radio" v-model="block.on_incorrect_response.next_action" name="incorrect" value="continue">Continue
          <br>
          <input type="radio" v-model="block.on_incorrect_response.next_action" name="incorrect" value="explanation">Show explanation
          <br>
          <input type="radio" v-model="block.on_incorrect_response.next_action" name="incorrect" value="learning_node">Send to different learning node
          <br>
          <div v-show="block.on_incorrect_response.next_action === 'continue'">
          </div>
          <div v-show="block.on_incorrect_response.next_action === 'explanation'">
            <div class="form-group">
              <strong>Explanation</strong>
              <vue-ckeditor v-model="block.on_incorrect_response.explanation_content" :config="editorOptions"/>
            </div>
          </div>
          <div v-show="block.on_incorrect_response.next_action === 'learning_node'">
            <div class="form-group">
              <strong>Different learning Node</strong>
              <div v-show="block.on_incorrect_response.learning_node.id == ''">
                <button class="btn btn-default btn-md" @click.prevent="setLearningNodeModalShow()">Set Learning Node</button>
              </div>
              <div v-show="block.on_incorrect_response.learning_node.id != ''">
                <span>{{block.on_incorrect_response.learning_node.title}}</span>
                <button class="btn btn-default btn-md" @click.prevent="setLearningNodeModalShow()">Change</button>
              </div>
            </div>
          </div>
          <div></div>
          <div></div>
        </div>
        <div class="text-right">
          <button class="btn btn-default btn-md" @click.prevent="showAddAnswerModal()">Add Answer</button>
        </div>
      </div>
      <div class="form-group">
        <div class="listAnswers mt-2" v-if="block" @end="updateAnswers">
          <draggable v-model="block.answers" :options="{draggable:'.item'}">
            <div class="border item rounded mb-3 p-4" v-for="(answer, index) in block.answers" :key="answer.en">
              <div class="answer-left">
                <label>{{answer.en}}
                  <span v-if="answer.sin != '' && answer.sin != null">({{answer.sin}})</span>
                </label>
                <div class="correct-answer" v-if="answer.is_correct === true">
                  <span>Correct Answer</span>
                </div>
              </div>
              <div class="answer-right">
                <div class="text-right">
                  <button class="btn btn-danger btn-sm" @click.prevent="removeAnswer(index)">Delete</button>
                </div>
                <div class="mt-4" v-if="answer.audio">
                  <audio controls style="width: 100%;">
                    <source :src="answer.audio" type="audio/ogg">
                      Your browser does not support the audio element.
                  </audio>
                </div>
              </div>
              
            </div>
          </draggable>
        </div>
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
  import LearningObjectiveMixin from './learning-objective-mixin'
  import VueCkeditor from 'vue-ckeditor2'
  import AddAnswerModal from './AddAnswerModal.vue'
  import draggable from 'vuedraggable'

  export default {
    mixins: [LearningObjectiveMixin],
    components: {
      Loading, VueCkeditor, AddAnswerModal, draggable
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
        editorOptions: {
          extraPlugins: 'html5audio',
          language: 'en'
        },
        block: {
          type: 'SimpleMCQ',
          instructions: {
            audio: ''
          },
          question: {
            en: ''
          },
          on_incorrect_response: {
            next_action: 'continue',
            explanation_content: '',
            learning_node: {
              id: '',
              title: ''
            }
          },
          answers: [],
          options: {
            automatic_next: false
          },
          evaluatable_objectives: [],
          title: ''
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
          var _block = JSON.parse(JSON.stringify(event.params.block))

          this.block = _block
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
      showAddAnswerModal(){
        this.$modal.show('learning-nodes.addanswer')
      },
      setLearningNodeModalShow(){
        this.$modal.show('learning-nodes.set-diff-node', {nodeID: this.node.id })
      },
      addAnswer(answer){
        this.loading = true
        let newAnswer = {}
        Object.assign(newAnswer, answer)
                
        this.block.answers.push(newAnswer)
        this.loading = false
      },
      removeAnswer(index) {
        this.loading = true
        this.block.answers.splice(index, 1)
        this.updateAnswers()
        this.loading = false
      },
      addBlock() {
        this.loading = true

        let blocks = this.node.blocks

        var tmp = document.createElement("div");
        tmp.innerHTML = this.block.question.en;
        this.block.title = tmp.innerText

        let newBlock = {}
        this.block.learning_objectives = this.learningObjectives.map(obj => obj.id)
        Object.assign(newBlock, this.block)

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
            this.$modal.hide('learning-nodes.simplemcq-dialogue')
            this.$flash.notify('success', "Block has been added successfully")
            this.$emit('added-block', res.data)
            
          })
          .catch((err) => {
            this.loading = false
            alert(err)
          })
      },
      updateAnswers() {
        var answers = [];
        for (let answer of this.block.answers) {
          answers.push(answer)
        }
        this.block.answers = answers
      },
      setLearningNode(learningNode) {
        this.block.on_incorrect_response.learning_node.id = learningNode.id
        this.block.on_incorrect_response.learning_node.title = learningNode.title
        this.block.on_incorrect_response.next_action = "learning_node"
      }
    }
  }
</script>

<style scoped>
  .objectiveModal .v--modal {
    top: 50px !important
  }
  .answer-left {
    float: left;
    width: 80%;
  }
  .answer-left .correct-answer span {
    color: #00FF00;
  }
  .answer-right {
    float: left;
    width: 20%;
  }
  .item {
    overflow: auto;
  }
  .listAnswers .item {
    background: #FFF;
    cursor: move;
  }
</style>
