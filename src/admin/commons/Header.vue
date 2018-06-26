<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <router-link class="navbar-brand" to="/">Sayhello</router-link>
    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
    </button>

    <div class="collapse navbar-collapse" id="navbarSupportedContent">
      <ul class="navbar-nav mr-auto">
        <li class="nav-item">
          <router-link class="nav-link" :to="{name: 'evaluation.evaluate'}">Evaluate</router-link>
        </li>
        <li class="nav-item">
          <router-link class="nav-link" :to="{name: 'students.index'}">Students</router-link>
        </li>
        <template v-if="currentUser.role !== 'Evaluator'">
          <li class="nav-item">
            <router-link class="nav-link" :to="{name: 'evaluation.precheck'}">Precheck</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" :to="{name: 'sessions.searches'}">Sessions search</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" :to="{name: 'learning.objectives'}">Learning Objectives</router-link>
          </li>
          
          <li class="nav-item">
            <router-link class="nav-link" :to="{name: 'conversations.index'}">Conversations</router-link>
          </li>
        </template>
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
  import currentUser from '../../mixins/current-user.js'

  export default {
    mixins: [currentUser],
    methods: {
      logout() {
        window.Bus.$emit('user.updated', null)
        localStorage.removeItem('access_token')
        this.$router.push('/')
      }
    }
  }
</script>
