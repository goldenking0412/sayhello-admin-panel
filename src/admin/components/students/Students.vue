<template>
  <div>
    <h2>Students</h2>
    <hr>
    <h4>Search</h4>
    <div class="row">
      <div class="col-sm-3">
        <div class="form-group">
            General search
          <input type="text" class="form-control" v-model="search.search" placeholder="By name, email, phone">
        </div>
      </div>
      <div class="col-sm-5">
        Took learning node
        <select v-model="search.took_learning_node" class="form-control">
          <option value="" selected></option>
          <option v-for="node in learningNodes" :key="node.id" :value="node.id">{{ node.title }}</option>
        </select>
      </div>
      <div class="col-sm-4">
        Learning node status
          <select v-model="search.learning_node_status" class="form-control">
            <option value="" selected></option>
            <option value="pending">Pending</option>
            <option value="rejected">Rejected</option>
            <option value="evaluation_pending">Evaluation Pending</option>
            <option value="completed">Complete</option>
          </select>
      </div>
    </div>
    <p class="text-right">
        <button class="btn btn-primary" @click.prevent="loadStudents()">
          Search
        </button>
    </p>
    <hr>
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
              <td>{{ $lodash.get(student, 'user.email') }}</td>
              <td>{{ $lodash.get(student, 'user.phone') }}</td>
              <td>{{ student.created_at | moment("DD/MM/YYYY")}}</td>
              <td>
                <router-link class="btn btn-sm btn-primary" :to="{name: 'students.show', params: {id: student.id}}">
                  Show
                </router-link>
              </td>
            </tr>
            <tr v-if="!students.length">
              <td colspan="6">
                Not found any students
              </td>
            </tr>
          </tbody>
        </table>
        <paginate
          :page-count="totalPages"
          :click-handler="changePage"
          :container-class="'pagination justify-content-end'"
          :page-class="'page-item'"
          :page-link-class="'page-link'"
          :prev-class="'page-item'"
          :prev-link-class="'page-link'"
          :next-class="'page-item'"
          :next-link-class="'page-link'">
        </paginate>
      </div>
    </section>
  </div>
</template>
<script>
  import Paginate from 'vuejs-paginate'

  export default {
    components: {
      Paginate
    },
    data() {
      return {
        students: [],
        learningNodes: [],
        total: 0,
        totalPages: 0,
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
        params.learning_node_status = params.learning_node_status ? params.learning_node_status : null

        this.axios.get('/v5/admin/students', {params: params})
          .then((res) => {
            this.students = res.data.data
            this.total = res.data.total
            this.search.per_page = res.data.per_page
            this.totalPages = Math.ceil(res.data.total / res.data.per_page)
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
      },
      changePage(page) {
        console.log(page)
        if(page && this.search.page != page) {
          this.search.page = page
          this.loadStudents()
        }
      }
    },
    mounted() {
      this.loadStudents()
      this.loadLearningNodes();
    }
  }
</script>
