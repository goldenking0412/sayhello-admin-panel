<template>
  <div class="listBlocks">
    <div class="border rounded mb-3 shadow p-4" v-for="block in blocks"
        :key="block.id">
      <BlockSystemDialogue v-bind:readonly="readonly" v-bind:block="block" v-if="block.type == 'SystemDialogue'"/>
      <BlockUserDialogue v-bind:readonly="readonly" v-bind:block="block" v-if="block.type == 'UserDialogue'"/>
      <BlockWebpage v-bind:readonly="readonly" v-bind:block="block" v-if="block.type == 'WebPage'"/>
      <BlockContent v-bind:readonly="readonly" v-bind:block="block" v-if="block.type == 'Content'"/>
    </div>
    <ContentModal />
    <WebpageModal />
  </div>
  
</template>

<script>
  import ContentModal from './ContentModal.vue'
  import WebpageModal from './WebpageModal.vue'
  import BlockContent from './Content.vue'
  import BlockWebpage from './Webpage.vue'
  import BlockUserDialogue from './UserDialogue.vue'
  import BlockSystemDialogue from './SystemDialogue.vue'

  export default {
    props: ['blocks', 'readonly'],
    components: {
      ContentModal, BlockContent, BlockWebpage, WebpageModal, BlockUserDialogue,
      BlockSystemDialogue
    },
  }
</script>