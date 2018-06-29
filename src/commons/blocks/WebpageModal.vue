<template>
  <modal name="blocks.webpage" class="webpageModal" @before-open="beforeOpen"
    :width="'80%'">
    <iframe width="100%" :src="block.url" frameborder="0"></iframe>
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

<style>
  .webpageModal .v--modal {
    top: 5vh !important;
    height: 90vh !important;
  }
</style>

<style scoped>
  
  .webpageModal iframe{
    height: 90vh;
  }
</style>
