<template>
  <div class="pageContent">
    <Header></Header>
    <LoginModal />
  </div>
</template>

<script>
  import Header from '../commons/Header.vue'
  import LoginModal from '../commons/Login.vue'

  export default {
    name: 'index',
    components: {
      Header, LoginModal
    }
  }
</script>
