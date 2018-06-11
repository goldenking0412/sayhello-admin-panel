<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <router-link class="navbar-brand" to="/">Sayhello</router-link>
    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
    </button>

    <div class="">
      <ul class="navbar-nav mr-auto">
        <li class="nav-item active">
          <router-link class="nav-link" :to="{name: 'sessions.searches'}">Sessions search</router-link>
        </li>
      </ul>
      <ul class="navbar-nav">
        <li class="nav-item active">
          <a @click.prevent="logout()" class="btn btn-outline-danger">Logout</a>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script>
  export default {
    methods: {
      logout() {
        window.Bus.$emit('user.updated', null)
        localStorage.removeItem('access_token')
        this.$router.push('/')
      }
    }
  }
</script>
