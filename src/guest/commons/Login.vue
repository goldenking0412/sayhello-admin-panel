<template>
  <modal name="login" class="loginModal">
    <h1>Login</h1>
    <form @submit.prevent="login">
      <div class="form-group">
        <label>Email</label>
        <input type="text" class="form-control" v-model="user.email">
      </div>
      <div class="form-group">
        <label>Password</label>
        <input type="password" class="form-control" v-model="user.password">
      </div>
      <div class="form-group text-center">
        <button class="btn btn-outline-success">Login</button>
      </div>
    </form>
  </modal>
</template>

<script>
  export default {
    data() {
      return {
        user: {
          email: '',
          password: '',
        },
      };
    },
    methods: {
      login() {
        this.axios.post('v3/login', this.user)
          .then((res) => {
            this.axios.defaults.headers['Authorization'] = 'Bearer ' +  res.data.access_token
            localStorage.setItem('access_token', res.data.access_token)
            this.$router.push("/admin/evaluators/evaluate")
            this.$flash.notify('success', 'Login successfully');
          })
          .catch((res) => {
            this.$flash.notify('danger', 'Invalid email or password!');
          })
      }
    }
  }
</script>
