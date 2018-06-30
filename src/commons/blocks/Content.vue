<template>
  <div>
    <div class="text-right">
      <strong class="text-secondary">{{ block.type }}</strong>
    </div>
    <div class="text-center">
      <button class="btn btn-primary" @click.prevent="showContent()">
        Show Content
      </button>
    </div>
    <div class="row" v-if="block.instructions && block.instructions.audio">
      <hr class="col-12">
      <div class="col-3 pt-3">
        <strong>Instructions:</strong>
      </div>
      <div class="col-9">
        <audio controls style="width: 100%;">
          <source :src="block.instructions.audio" type="audio/mpeg">
        </audio>
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
    methods: {
      showContent() {
        this.$modal.show('blocks.content', this.block)
      }
    }
  }
</script>
