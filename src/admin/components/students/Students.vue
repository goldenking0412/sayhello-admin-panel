<template>
  <div>
    <h2>Students</h2>
    <hr>
    <h4>Search</h4>
    <div class="row">
      <div class="col-sm-4">
        <div class="form-group">
          <input type="text" class="form-control" v-model="search.search" placeholder="By name, email, phone">
        </div>
      </div>
      <div class="col-sm-6">
        <div class="row">
          <div class="col-4" style="margin-top: 7px;">
            Took learning node
          </div>
          <div class="col-8">
            <select v-model="search.took_learning_node" class="form-control">
              <option value="" selected></option>
              <option v-for="node in learningNodes" :key="node.id" :value="node.id">{{ node.title }}</option>
            </select>
          </div>
        </div>
      </div>
      <div class="col-sm-2">
        <button class="btn btn-primary" @click.prevent="loadStudents()">
          Search
        </button>
      </div>
    </div>
    <section class="section">
      <div>
        Results: <strong>{{ total }}</strong>
      </div>
      <div class="table-responsive">
        <table class="table table-striped">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Registered Since</th>
              <th>View</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="student in students" :key="student.id">
              <td>{{ student.name }}</td>
              <td>{{ student.email }}</td>
              <td>{{ student.phone }}</td>
              <td>{{ student.created_at | moment("DD/MM/YYYY")}}</td>
              <td>
                <button class="btn btn-sm btn-primary" @click.prevent="showObjective(object)">
                  View
                </button>
              </td>
            </tr>
            <tr v-if="!students.length">
              <td colspan="6">
                Not found any students
              </td>
            </tr>
          </tbody>
        </table>
        <Pagination />
      </div>
    </section>
  </div>
</template>
<script>
  import Pagination from '../../../commons/Pagination.vue'

  export default {
    components: {
      Pagination
    },
    data() {
      return {
        students: [],
        learningNodes: [],
        total: 0,
        search: {
          per_page: 50,
          page: 1,
          search: '',
          took_learning_node: ''
        }
      }
    },
    methods: {
      showObjective(objective) {
        this.$modal.show('objective.show', objective)
      },
      loadStudents() {
        let params = {}
        Object.assign(params, this.search)
        params.took_learning_node = params.took_learning_node ? params.took_learning_node : null

        this.axios.get('/v5/admin/students', {params: params})
          .then((res) => {
            this.students = res.data.data
            this.total = res.data.total
          })
          .catch((err) => {

          })
      },
      loadLearningNodes() {
        this.axios.get('/v5/admin/learning_nodes', {params: {perpage: 9999}})
          .then((res) => {
            this.learningNodes = res.data.data;
          })
          .catch((err) => {

          })
      }
    },
    mounted() {
      this.loadStudents()
      this.loadLearningNodes();
    }
  }
</script>
