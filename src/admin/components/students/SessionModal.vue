<template>
  <div>
    <modal name="students.tags" style="z-index: 9999;" @before-open="loadStudentTag">
      <h4 class="p-3">Student Tags</h4>
      <div class="row">
        <div class="col-md-12">
          <vue-tags-input
            style="max-width: none;"
            v-model="studentTag"
            :tags="studentTags"
            @tags-changed="newTags => studentTags = newTags"
            :autocomplete-items="studentTagsHints"
            :add-only-from-autocomplete="true"
          />
        </div>
        <div class="col-md-12 pull-right" style="padding-top: 15px; text-align: right;">
          <button class="btn btn-danger" style="margin: 5px;" @click="closeStudentModal">
            cancel
          </button>
          <button class="btn btn-primary" @click="saveStudentTags">
            save
          </button>
        </div>
      </div>
      <Loading v-if="loadingStudentTags"/>
    </modal>
    <modal name="sessions.tags" style="z-index: 9999;">
      <h4 class="p-3">Session Tags</h4>
      <div class="row">
        <div class="col-md-12">
          <vue-tags-input
            style="max-width: none;"
            v-model="sessionTag"
            :tags="sessionTags"
            @tags-changed="newTags => sessionTags = newTags"
            :autocomplete-items="sessionTagsHints"
            :add-only-from-autocomplete="true"
          />
        </div>
        <div class="col-md-12 pull-right" style="padding-top: 15px; text-align: right;">
          <button class="btn btn-danger" style="margin: 5px;" @click="closeSessionModal">
            cancel
          </button>
          <button class="btn btn-primary" @click="saveSessionTags">
            save
          </button>
        </div>
      </div>
      <Loading v-if="loadingSessionTags"/>
    </modal>
    <modal name="students.session" class="sessionModal" @before-open="beforeOpen">
      <div v-if="lesson" class="modalBody">
        <div class="tagDropdown">
          <div class="dropdown">
            <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              Add Tag/Notes
            </button>
            <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
              <a class="dropdown-item" @click="openStudentModal" style="cursor: pointer;">Student</a>
              <a class="dropdown-item" @click="openSessionModal" style="cursor: pointer;">Session</a>
            </div>
          </div>
        </div>
        <h4 class="p-3">{{ lesson.title }}</h4>
        <p>
          {{ lesson.description }}
        </p>
        <div class="sessionContent">
          <h6>Student</h6>
          <h3>{{ session.student.name }}</h3>
          <h3><small>Student ID - {{ session.student.id }}</small></h3>
          <h3><small>Session ID - {{ session.id }}</small></h3>
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
              <star-rating v-model="evaluateObj.evaluated_data.rating"></star-rating>
            </div>

            <div v-if="evaluateObj.rating_scale == 'Criteria.RatingScale.YesNo'">
                <yes-no v-model="evaluateObj.evaluated_data.choice"></yes-no>
            </div>

            <div v-if="evaluateObj.rating_scale == 'Criteria.RatingScale.MultipleChoice'">
              <multiple-choice v-model="evaluateObj.evaluated_data.choice" :choices="evaluateObj.evaluation_config.choices"></multiple-choice>
            </div>
          </div>
        </div>
        <div class="text-center mt-1 mb-1 border-top pt-1">
          <button class="btn btn-danger" @click.prevent="rejectSession()">
            Reject
          </button>
        </div>
      </div>
      <Loading v-if="loading"/>
      <RejectSessionModal />
    </modal>
  </div>
</template>

<script>
  import RejectSessionModal from './RejectSessionModal.vue'
  import Loading from '../../../commons/Loading.vue'
  import MultipleChoice from '../evaluation/RatingScale/MultipleChoice'
  import YesNo from '../evaluation/RatingScale/YesNo'
  import StarRating from 'vue-star-rating'
  import {Howl, Howler} from 'howler'
  import VueTagsInput from '@johmun/vue-tags-input'

  export default {
    components: {
      Loading, MultipleChoice, 'yes-no': YesNo, StarRating, VueTagsInput,
      RejectSessionModal
    },
    data() {
      return {
        session: null,
        sessionId: null,
        lesson: null,
        loading: false,
        processing: false,
        activeAudio: false,
        activeAudioIndex: false,
        loadingStudentTags: false,
        loadingSessionTags: false,
        studentTags: [],
        studentTagsHints: [],
        studentTag: '',
        sessionTagsHints: [],
        sessionTags: [],
        sessionTag: ''
      }
    },
    methods: {
      beforeOpen(event) {
        this.sessionId = event.params
        this.loadSessions()
      },
      saveStudentTags () {
        this.axios.put('/v5/admin/students/' + this.session.student.id, {
          tags: this.studentTags.map(tag => tag.text)
          }).then((res) => {
            this.$modal.hide('students.tags')
          }).catch((res) => {
            this.$modal.hide('students.tags')
          })
      },
      loadStudentTag() {
        this.loadingStudentTags = true
        this.studentTags = []
        this.axios.get('/v5/admin/students/' + this.session.student.id)
          .then((res) => {
            this.loadingStudentTags = false
            this.studentTags = res.data.data.tags.map(tag => { return {text: tag, tiClasses: ['valid']} })
          }).catch((res) => {
            this.loadingStudentTags = false
          })
      },
      loadStudentTagHints() {
        this.studentTagsHints = []
        this.axios.get('/v5/admin/tags', {params: {search: this.studentTag, context: 'Student'}})
          .then((res) => {
            this.studentTagsHints = res.data.tags.map(tag => { return {text: tag, tiClasses: ['valid']} })
          }).catch((res) => {
          })
      },
      saveSessionTags () {
        this.axios.put('/v5/admin/sessions/' + this.session.id, {
          tags: this.sessionTags.map(tag => tag.text)
          }).then((res) => {
            this.$modal.hide('sessions.tags')
          }).catch((res) => {
            this.$modal.hide('sessions.tags')
          })
      },
      loadSessionTagHints() {
        this.sessionTagsHints = []
        this.axios.get('/v5/admin/tags', {params: {search: this.sessionTag, context: 'Session'}})
          .then((res) => {
            this.sessionTagsHints = res.data.tags.map(tag => { return {text: tag, tiClasses: ['valid']} })
          }).catch((res) => {
          })
      },
      loadSessions() {
        this.loading = true
        this.axios.get('/v5/admin/learning_nodes/sessions/' + this.sessionId)
          .then((res) => {
            this.loading = false
            this.session = res.data.session
            this.lesson = res.data.lesson
            this.lesson.evaluatable_objectives.map(obj => {
              obj.evaluated_data = obj.evaluated_data ? obj.evaluated_data : {}

              return obj
            })
            this.sessionTags = res.data.session.tags.map(tag => { return {text: tag, tiClasses: ['valid']} })
          })
          .catch((res) => {
            this.loading = false
          })
      },
      close() {
        this.$modal.hide('students.addNote');
      },
      openStudentModal() {
        this.$modal.show('students.tags');
      },
      openSessionModal() {
        this.$modal.show('sessions.tags');
      },
      closeStudentModal() {
        this.$modal.hide('students.tags');
      },
      closeSessionModal() {
        this.$modal.hide('sessions.tags');
      },
      rejectSession() {
        this.$modal.show('sessions.reject', this.session.id)
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
    },
    watch: {
      studentTag () {
        this.loadStudentTagHints()
      },
      sessionTag () {
        this.loadSessionTagHints()
      }
    }
  }
</script>