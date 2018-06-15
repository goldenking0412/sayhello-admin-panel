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
            <select name="" id="" class="form-control">
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
              <th>Last Learning Node</th>
              <th>Registered Since</th>
              <th>View</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="object in students" :key="object.id">
              <td>{{ object.title }}</td>
              <td>
                <span class="badge badge-secondary" v-for="tag in object.tags" :key="tag"
                  style="margin-right: 5px;">
                  {{ tag }}
                </span>
              </td>
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
        total: 0,
        search: {
          limit: 50,
          page: 1,
          search: ''
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

        this.axios.get('/v5/students')
        .then((res) => {
          this.learnings = res.data.data
          this.total = res.data.total
        })
        .catch((err) => {

        })
      }
    },
    mounted() {
      this.loadStudents()
    }
  }
</script>
