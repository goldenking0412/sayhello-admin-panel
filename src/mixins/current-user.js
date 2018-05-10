export default {
  data() {
    return {
      currentUser: window.user
    }
  },
  mounted() {
    window.Bus.$on('user.updated', this.setCurrentUser)
  },
  methods: {
    setCurrentUser(user) {
      this.currentUser = user
      window.user = user
    }
  }
}