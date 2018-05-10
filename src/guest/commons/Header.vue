<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <router-link class="navbar-brand" to="/">Sayhello</router-link>
    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
    </button>

    <div class="collapse navbar-collapse">
      <ul class="navbar-nav mr-auto">
        <li class="nav-item active" v-if="currentUser">
          <router-link class="nav-link" to="/admin">Admin</router-link>
        </li>
      </ul>
      <ul class="navbar-nav">
        <li class="nav-item active" v-if="currentUser">
          <a @click.prevent="logout()" class="btn btn-outline-success">Logout</a>
        </li>
        <li class="nav-item active" v-else>
          <a @click.prevent="login()" class="btn btn-outline-success">Login</a>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script>
  import currentUser from '../../mixins/current-user'

  export default {
    mixins: [currentUser],
    mounted() {
    },
    methods: {
      login() {
        this.$modal.show('login')
      },
      logout() {
        window.Bus.$emit('user.updated', null)
        localStorage.removeItem('access_token')
        this.$router.push('/')
      }
    },
  }
</script>
