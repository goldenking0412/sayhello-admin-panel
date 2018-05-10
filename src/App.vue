<template>
  <div class="pageWrapper">
    <router-view></router-view>
    <flash-float title="" classes="flashContainer" ></flash-float>
  </div>
</template>

<script>
  import currentUser from './mixins/current-user'

  export default {
    name: 'app',
    mixins: [currentUser]
  }
</script>
