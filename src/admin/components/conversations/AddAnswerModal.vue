<template>
  <modal name="learning-nodes.addanswer" class="objectiveModal" @before-open="beforeOpen"
    :scrollable="true">
    <h4 class="text-center mb-4">Add Answer</h4>
    <form @submit.prevent="validateBeforeSubmit">
      <div class="form-group">
        <p>Answer</p>
        <input type="text" class="form-control" v-model="answer.en" name="answer">
      </div>
      <div class="form-group">
        <p>Sinhala Meaning</p>
        <input type="text" class="form-control" v-model="answer.sin" name="sinhala_meaning">
      </div>
      <div class="form-group">
        <p>Audio</p>
        <input type="text" class="form-control" v-model="answer.audio" v-validate="'url'" name="audio">
        <div class="invalid-feedback" v-if="errors.has('audio')" style="display: block;">
          {{ errors.first('audio') }}
        </div>
      </div>
      <div class="form-group">
        <label>
          <input type="checkbox" v-model="answer.is_correct">Correct answer
        </label>
      </div>
      <div class="text-right">
        <button class="btn btn-default btn-md" @click.prevent="addAnswer()">Add</button>
      </div>
    </form>
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
        type: 'AddAnswer',
        answer: {
          en: '',
          sin: '',
          is_correct: false,
          audio: ''
        }
      }
    },
    mounted() {
    },
    methods: {
      beforeOpen(event) {
        this.answer.is_correct = false;
        this.answer.en = '';
        this.answer.sin = '';
        this.answer.audio = '';
      },
      validateBeforeSubmit() {
        this.$validator.validateAll().then((result) => {
          if (result) {
            this.addAnswer()
            return
          }
        });
      },
      addAnswer() {
        this.$emit('add-answer', this.answer)
        this.$modal.hide('learning-nodes.addanswer')
      }
    }
  }
</script>

<style>
  .objectiveModal .v--modal {
    top: 50px !important
  }
</style>
