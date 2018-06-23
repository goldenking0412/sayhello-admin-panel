<template>
  <modal name="students.session" class="sessionModal" @before-open="beforeOpen">
    <div v-if="lesson" class="modalBody">
      <h4 class="p-3">{{ lesson.title }}</h4>
      <p>
        {{ lesson.description }}
      </p>
      <div class="sessionContent">
        <h6>Student</h6>
        <h3>{{ session.student.name }}</h3>
        <h3><small>{{ session.student.id }}</small></h3>
        <hr>
        <div v-for="(block, blockIndex) in session.lesson.blocks" class="card">
          <div class="card-body">
            <h4>{{ block.question.en }}</h4>
            <button v-if="activeAudioIndex !== blockIndex" class="btn btn-primary" @click="playAudio(blockIndex)">Play</button>
            <button v-if="activeAudioIndex === blockIndex" class="btn btn-danger" @click="stopAudio()">Stop</button>
            <hr>
            <div
              v-for="(blockEvaluateObj, blockEvaluateObjIndex) in block.evaluatable_objectives">
              <h5 class="text-info">{{ $lodash.get(blockEvaluateObj, 'evaluation_config.question') }}</h5>

              <div style="margin-bottom: 10px" v-if="blockEvaluateObj.rating_scale == 'Criteria.RatingScale.OneFive'">
                <star-rating v-model="blockEvaluateObj.rating"></star-rating>
              </div>

              <div v-if="blockEvaluateObj.rating_scale == 'Criteria.RatingScale.YesNo'">
                <yes-no v-model="blockEvaluateObj.condition_met"></yes-no>
              </div>

              <div v-if="blockEvaluateObj.rating_scale == 'Criteria.RatingScale.MultipleChoice'">
                <multiple-choice v-model="blockEvaluateObj.choice" :choices="blockEvaluateObj.evaluation_config.choices"></multiple-choice>
              </div>
            </div>
          </div>
        </div>
        <hr>
        <h2 class="text-center">Overall Feedback</h2>
        <div v-for="(evaluateObj, evaluateObjIndex) in lesson.evaluatable_objectives" :key="evaluateObj.id">
          <h5 v-if="evaluateObj.rating_scale != 'Criteria.RatingScale.GeneralFeedback'"class="text-info">{{ $lodash.get(evaluateObj, 'title') }}</h5>
          <pre v-if="evaluateObj.rating_scale != 'Criteria.RatingScale.GeneralFeedback'">{{ $lodash.get(evaluateObj, 'evaluation_config.question') }}</pre>

          <div style="margin-bottom: 10px" v-if="evaluateObj.rating_scale == 'Criteria.RatingScale.OneFive'">
            <star-rating v-model="evaluateObj.rating"></star-rating>
          </div>

          <div v-if="evaluateObj.rating_scale == 'Criteria.RatingScale.YesNo'">
              <yes-no v-model="evaluateObj.condition_met"></yes-no>
          </div>

          <div v-if="evaluateObj.rating_scale == 'Criteria.RatingScale.MultipleChoice'">
            <multiple-choice v-model="evaluateObj.choice" :choices="evaluateObj.evaluation_config.choices"></multiple-choice>
          </div>
        </div>
      </div>
    </div>
    <Loading v-if="loading"/>
  </modal>
</template>

<script>
  import Loading from '../../../commons/Loading.vue'
  import MultipleChoice from '../evaluation/RatingScale/MultipleChoice'
  import YesNo from '../evaluation/RatingScale/YesNo'
  import StarRating from 'vue-star-rating'
  import {Howl, Howler} from 'howler'

  export default {
    components: {
      Loading, MultipleChoice, 'yes-no': YesNo, StarRating
    },
    data() {
      return {
        session: null,
        lesson: null,
        loading: false,
        processing: false,
        activeAudio: false,
        activeAudioIndex: false,
      }
    },
    methods: {
      beforeOpen(event) {
        this.node = event.params
        this.loadSessions()
      },
      loadSessions() {
        this.loading = true
        this.axios.get('/v5/admin/learning_nodes/sessions/' + this.node.active_session_id)
          .then((res) => {
            this.loading = false
            this.session = res.data.session
            this.lesson = res.data.lesson
          })
          .catch((res) => {
            this.loading = false
          })
      },
      close() {
        this.$modal.hide('students.addNote');
      },
      playAudio(index) {
        if (this.activeAudio)
          this.activeAudio.stop();

        let url = this.session.lesson.blocks[index].answer.audio;
        this.activeAudioIndex = index;
        this.activeAudio = new Howl({src: [url]});
        this.activeAudio.on("end", () => {
          this.stopAudio();
        });
        this.activeAudio.play();
      },
      stopAudio() {
          if (this.activeAudio)
              this.activeAudio.stop();
          this.activeAudioIndex = false;
      },
    }
  }
</script>