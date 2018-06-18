<template>
  <modal name="students.addNote" class="objectiveModal" @before-open="beforeOpen">
    <h4 class="text-center mb-4">Add Note <span v-if="student"> - {{ student.name }}</span></h4>
    <form @submit.prevent="validateBeforeSubmit">
      <div class="form-group">
        <textarea name="note" rows="10" class="form-control" v-model="note" placeholder="Note..."
          v-validate="'required'" :class="{'is-invalid': errors.has('note') }"></textarea>
        <div class="invalid-feedback" v-if="errors.has('note')">
          {{ errors.first('note') }}
        </div>
      </div>

      <div class="text-right">
        <button class="btn btn-default btn-md" @click.prevent="close()">Close</button>
        <button class="btn btn-primary btn-md ml-2">
          Create
        </button>
      </div>
    </form>
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
        student: null,
        note: '',
        loading: false
      }
    },
    methods: {
      beforeOpen(event) {
        this.student = event.params
      },
      validateBeforeSubmit() {
        this.$validator.validateAll().then((result) => {
          if (result) {
            this.createNote()
            return
          }
        });
      },
      createNote() {
        this.loading = true

        this.axios.post('/v5/admin/students/' + this.student.id + '/notes', { note: this.note})
          .then((res) => {
            this.loading = false
            this.$modal.hide('students.addNote')
            this.$emit('added-note', res.data)
            this.$flash.notify('success', "Note has been added successfully")
          })
          .catch((err) => {
            this.loading = false
          })
      },
      close() {
        this.$modal.hide('students.addNote');
      }
    }
  }
</script>
