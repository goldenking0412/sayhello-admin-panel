<template>
  <div>
    <Header></Header>
    <main>
      <div class="container">
        <router-view></router-view>
      </div>
    </main>
  </div>
</template>

<script>
  import Header from '../commons/Header.vue'

  export default {
    components: {
      Header
    }
  }
</script>
