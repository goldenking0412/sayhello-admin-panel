<template>
  <div v-if="block.evaluatable_objectives.length">
    <hr>
    <div v-for="(blockEvaluateObj, blockEvaluateObjIndex) in block.evaluatable_objectives" :key="blockEvaluateObjIndex">
      <div v-if="!readonly || blockEvaluateObj.evaluated_data && readonly">
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
</template>

<script>
  import YesNo from './../../admin/components/evaluation/RatingScale/YesNo'
  import MultipleChoice from './../../admin/components/evaluation/RatingScale/MultipleChoice'
  import StarRating from 'vue-star-rating'

  export default {
    props: ['block', 'readonly'],
    components: {
      StarRating,
      MultipleChoice,
      'yes-no': YesNo
    },
    mounted() {
    }
  }
</script>
