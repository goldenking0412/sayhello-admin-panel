<template>
  <modal name="students.add-learning-node" class="objectiveModal" @before-open="beforeOpen">
    <h4 class="text-center mb-4">Add Learning Node <span v-if="student"> - {{ student.name }}</span></h4>
    <form @submit.prevent="validateBeforeSubmit">
      <div class="form-group">
        <label>Learning Node:</label>
        <select name="learning_node" class="form-control" :class="{'is-invalid': errors.has('learning_node') }"
          v-validate="'required'" v-model="learning_node_id">
            <option value="">-- Select --</option>
            <option v-for="node in learningNodes" :value="node.id" :key="node.id">
              {{ node.title }}
            </option>
        </select>
        <div class="invalid-feedback" v-if="errors.has('learning_node')">
          {{ errors.first('learning_node') }}
        </div>
      </div>
      <hr>
      <div class="text-right mt-4">
        <button class="btn btn-default btn-md" @click.prevent="close()">Close</button>
        <button class="btn btn-primary btn-md ml-2">
          Add
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
        learning_node_id: '',
        learningNodes: [],
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
        this.axios.get('/v5/admin/learning_nodes', {params: {perpage: 9999}})
          .then((res) => {
            this.learningNodes = res.data.data;
          })
          .catch((err) => {

          })
      },
      addNode() {
        this.loading = true

        this.axios.post('/v5/admin/students/' + this.student.id + '/learning_nodes',
            { learning_node_id: this.learning_node_id})
          .then((res) => {
            this.loading = false
            this.$modal.hide('students.add-learning-node')
            this.$emit('added-learning-node', res.data)
          })
          .catch((res) => {
            this.loading = false

            let errors = res.response.data.errors;
            this.$flash.notify('danger', errors[0])
          })
      },
      close() {
        this.$modal.hide('students.add-learning-node');
      }
    }
  }
</script>
