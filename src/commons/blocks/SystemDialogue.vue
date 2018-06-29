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
