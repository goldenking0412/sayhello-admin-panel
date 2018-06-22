<template>
  <modal name="students.assign-evaluator" class="objectiveModal" @before-open="beforeOpen">
    <h4 class="text-center mb-4">Assign Evaluator <span v-if="student"> - {{ student.name }}</span></h4>
    <form @submit.prevent="validateBeforeSubmit">
      <div class="form-group">
        <label>Evaluator:</label>
        <select name="evaluator" class="form-control" :class="{'is-invalid': errors.has('evaluator') }"
          v-validate="'required'" v-model="evaluator_id">
            <option value="">-- Select --</option>
            <option v-for="evaluator in evaluators" :value="evaluator.id" :key="evaluator.id">
              {{ evaluator.name }}
            </option>
        </select>
        <div class="invalid-feedback" v-if="errors.has('evaluator')">
          {{ errors.first('evaluator') }}
        </div>
      </div>
      <hr>
      <div class="text-right mt-4">
        <button class="btn btn-default btn-md" @click.prevent="close()">Close</button>
        <button class="btn btn-primary btn-md ml-2">
          Assign
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
        evaluator_id: '',
        evaluators: [],
        loading: false
      }
    },
    mounted() {
      this.loadLearningNodes()
    },
    methods: {
      beforeOpen(event) {
        this.student = event.params
      },
      validateBeforeSubmit() {
        this.$validator.validateAll().then((result) => {
          if (result) {
            this.addNode()
            return
          }
        });
      },
      loadLearningNodes() {
        this.axios.get('/v5/admin/users', {params: { role: 'evaluator', per_page: 9999}})
          .then((res) => {
            this.evaluators = res.data.data
          })
          .catch((err) => {

          })
      },
      addNode() {
          this.loading = true
          this.axios.put('/v5/admin/students/' + this.student.id,
              { evaluator_id: this.evaluator_id })
            .then((res) => {
              this.loading = false
              this.$modal.hide('students.assign-evaluator')
              this.$emit('assigned-evaluator', res.data)
              this.$flash.notify('success', "Evaluator has been assigned successfully")
            })
            .catch((res) => {
              this.loading = false
            })
      },
      close() {
        this.$modal.hide('students.assign-evaluator');
      }
    }
  }
</script>
