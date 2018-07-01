<template>
  <div>
    <div class="text-right">
      <strong class="text-secondary">{{ block.type }}</strong>
      <div>
        <strong>{{ block.character.name }}</strong>
      </div>
    </div>
    <div class="text-left">
      <h5>{{ block.en.text }}</h5>
      <p v-if="block.sin.text">
        {{ block.sin.text }}
      </p>
    </div>
    <hr>
    <div class="row mb-4" v-if="block.fill_words && block.fill_words.length">
      <div class="col-3">
        <strong>Words for blanks:</strong>
      </div>
      <div class="col-9">
        <strong class="text-primary">{{ block.fill_words.join(', ') }}</strong>
      </div>
    </div>
    <div class="row" v-if="block.sample_response && block.sample_response.audio">
      <div class="col-3 pt-3">
        <strong>Sample Response:</strong>
      </div>
      <div class="col-9">
        <audio controls style="width: 100%;">
          <source :src="block.sample_response.audio" type="audio/mpeg">
        </audio>
      </div>
    </div>
    <div class="row" v-if="block.instructions && block.instructions.audio">
      <div class="col-3 pt-3">
        <strong>Instructions:</strong>
      </div>
      <div class="col-9">
        <audio controls style="width: 100%;">
          <source :src="block.instructions.audio" type="audio/mpeg">
        </audio>
      </div>
    </div>
    <div v-if="block.response && block.response.audio">
      <hr>
      <div class="row">
        <div class="col-3 pt-3">
          <strong>Student Response:</strong>
        </div>
        <div class="col-9">
          <audio controls style="width: 100%;">
            <source :src="block.response.audio" type="audio/mpeg">
          </audio>
        </div>
      </div>
    </div>
    <EvaluatorObjectives v-bind:block="block" />
  </div>
</template>
<script>
  import EvaluatorObjectives from './EvaluatorObjectives.vue'

  export default {
    props: ['block'],
    components: { EvaluatorObjectives },
    mounted() {
    },
  }
</script>
