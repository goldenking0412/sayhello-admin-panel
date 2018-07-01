<template>
  <modal name="students.show" class="commonModal" @before-open="beforeOpen"
    :width="'80%'" :height="'90%'">
    <button class="btn btn-close" @click.prevent="close()">
      X
    </button>
    <Student v-bind:id="studentId"/>
  </modal>
</template>

<script>
  import Student from './Student.vue'

  export default {
    components: {
      Student
    },
    data() {
      return {
        studentId: null
      }
    },
    methods: {
      beforeOpen(event) {
        this.studentId = event.params
      },
      close() {
        this.$modal.hide('students.show');
      }
    }
  }
</script>