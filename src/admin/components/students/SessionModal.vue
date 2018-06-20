<template>
  <modal name="students.session" class="sessionModal" @before-open="beforeOpen">
    <div v-if="lesson" class="modalBody">
      <h4 class="p-3">{{ lesson.title }}</h4>
      <p>
        {{ lesson.description }}
      </p>
      <div class="sessionContent">
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

  export default {
    components: {
      Loading, MultipleChoice, 'yes-no': YesNo, StarRating
    },
    data() {
      return {
        session: null,
        lesson: null,
        loading: false
      }
    },
    methods: {
      beforeOpen(event) {
        this.node = event.params
        this.loadSessions()
      },
      loadSessions() {
        this.loading = true
        this.axios.get('/v5/admin/learning_nodes/sessions/' + this.node.id)
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
      }
    }
  }
</script>