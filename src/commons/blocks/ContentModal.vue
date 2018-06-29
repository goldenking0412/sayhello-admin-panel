<template>
  <modal name="blocks.content" class="objectiveModal" @before-open="beforeOpen"
    :width="'80%'">
    <div v-html="block.content">
    </div>
  </modal>
</template>

<script>

  export default {
    data() {
      return {
        block: {}
      }
    },
    methods: {
      beforeOpen(event) {
        this.block = event.params
      },
      close() {
        this.$modal.hide('blocks.content');
      }
    }
  }
</script>
