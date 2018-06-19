<template>
  <modal name="students.edit" class="objectiveModal" @before-open="beforeOpen">
    <h4 class="text-center mb-4">Edit <span v-if="student"> - {{ student.name }}</span></h4>
    <form @submit.prevent="validateBeforeSubmit">
      <div class="form-group">
        <label>Status:</label>
        <select name="status" v-validate="'required'" class="form-control" v-model="params.status_change.status"
          :class="{'is-invalid': errors.has('status') }">
          <option value="">-- Select status --</option>
          <option value="active">Active</option>
          <option value="suspended">Suspended</option>
        </select>
        <div class="invalid-feedback" v-if="errors.has('status')">
          {{ errors.first('status') }}
        </div>
      </div>
      <div class="form-group" v-if="student">
        <label>Tags:</label>
        <vue-tags-input
            v-model="tag"
            :tags="tags"
            @tags-changed="newTags => tags = newTags"
          />
      </div>
      <hr>
      <div class="text-right mt-4">
        <button class="btn btn-default btn-md" @click.prevent="close()">Close</button>
        <button class="btn btn-success btn-md ml-2">
          Update
        </button>
      </div>
    </form>
    <Loading v-if="loading"/>
  </modal>
</template>

<script>
  import Loading from '../../../commons/Loading.vue'
  import VueTagsInput from '@johmun/vue-tags-input';

  export default {
    components: {
      Loading, VueTagsInput
    },
    data() {
      return {
        student: null,
        tag: '',
        tags: [],
        params: {
          status_change: {
            status: '',
            reason: 'Reason'
          },
          tags: []
        },
        loading: false
      }
    },
    mounted() {
    },
    methods: {
      beforeOpen(event) {
        this.student = event.params
        this.params.status_change.status = this.student.status
        this.tags = this.student.tags.map(tag => { return {text: tag, tiClasses: ['valid']} })
      },
      validateBeforeSubmit() {
        this.$validator.validateAll().then((result) => {
          if (result) {
            this.updateStudent()
            return
          }
        })
      },
      updateStudent() {
        this.params.tags = this.tags.map(tag => tag.text)

        this.loading = true
        this.axios.put('/v5/admin/students/' + this.student.id, this.params)
          .then((res) => {
            this.loading = false
            this.close()
            this.$emit('user-updated', res.data.data)
            this.$flash.notify('success', "Student has been updated successfully")
          })
          .catch((res) => {
            this.loading = false
          })
      },
      close() {
        this.$modal.hide('students.edit');
      }
    }
  }
</script>

<style scoped>
  .vue-tags-input {
    max-width: initial !important;
    width: 100%;
  }

  .input {
    display: block;
    width: 100%;
    padding: .375rem .75rem;
    font-size: 1rem;
    line-height: 1.5;
    color: #495057;
    background-color: #fff;
    background-clip: padding-box;
    border: 1px solid #ced4da;
    border-radius: .25rem;
    -webkit-transition: border-color .15s ease-in-out,-webkit-box-shadow .15s ease-in-out;
    transition: border-color .15s ease-in-out,-webkit-box-shadow .15s ease-in-out;
    transition: border-color .15s ease-in-out,box-shadow .15s ease-in-out;
    transition: border-color .15s ease-in-out,box-shadow .15s ease-in-out,-webkit-box-shadow .15s ease-in-out;
  }
</style>
