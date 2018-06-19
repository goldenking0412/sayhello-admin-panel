<template>
  <modal name="students.session" class="objectiveModal" @before-open="beforeOpen">
    <h4 class="text-center mb-4">Add Note</h4>
   
    <Loading v-if="loading"/>
  </modal>
</template>

<script>
  import Loading from '../../../commons/Loading.vue'

  export default {
    components: {
      Loading
    },
    data() {
      return {
        node: null,
        note: '',
        loading: false
      }
    },
    methods: {
      beforeOpen(event) {
        this.node = event.params
        this.loadSessions()
      },
      loadSessions() {
        this.loading = true
        this.axios.get('/v5/admin/learning_nodes/sessions/' + this.node.active_session_id)
          .then((res) => {
            this.loading = false
          })
          .catch((res) => {
            this.loading = false
          })
      },
      close() {
        this.$modal.hide('students.addNote');
      }
    }
  }
</script>
