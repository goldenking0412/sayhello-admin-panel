<template>
  <div>
    <h2>Students</h2>
    <hr>
    <h4>Search</h4>
    <div class="row">
      <div class="col-sm-3">
        <div class="form-group">
          <label for="">Name</label>
          <input type="text" class="form-control" v-model="search.name">
        </div>
      </div>
      <div class="col-sm-3">
        <div class="form-group">
          <label for="">Email</label>
          <input type="text" class="form-control" v-model="search.email">
        </div>
      </div>
      <div class="col-sm-3">
        <div class="form-group">
          <label for="">Phone</label>
          <input type="text" class="form-control" v-model="search.phone">
        </div>
      </div>
      <div class="col-sm-3">
        <div class="form-group">
          <label for="">Messenger ID</label>
          <input type="text" class="form-control" v-model="search.messenger_id">
        </div>
      </div>
      <div class="col-sm-6">
        <div class="form-group">
          <label>Took learning node</label>
          <select v-model="search.took_learning_node" class="form-control">
            <option value="" selected></option>
            <option v-for="node in learningNodes" :key="node.id" :value="node.id">{{ node.title }}</option>
          </select>
        </div>
      </div>
      <div class="col-sm-6">
        <div class="form-group">
          <label>Tags:</label>
          <vue-tags-input
              v-model="tag"
              :tags="tags"
              @tags-changed="newTags => tags = newTags"
              :autocomplete-items="getAutocompleteTags(tag)"
            />
        </div>
      </div>
    </div>
    <p class="text-right">
        <button class="btn btn-primary" @click.prevent="searchStudents()">
          Search
        </button>
    </p>
    <hr>
    <section class="section">
      <div class="table-responsive">
        <div class="row">
          <div class="col-6">
            Results: <strong>{{ total }}</strong>
          </div>
          <div class="col-6">
            <v-pagination :pages="totalPages" v-on:page-changed="changePage"
              ref="paginateTop"></v-pagination>
          </div>
        </div>
        <table class="table table-striped">
          <thead>
            <tr>
              <th>Id</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Tags</th>
              <th>Registered Since</th>
              <th>View</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="student in students" :key="student.id">
              <td>{{ student.id }}</td>
              <td>{{ student.name }}</td>
              <td>{{ $lodash.get(student, 'user.email') }}</td>
              <td>{{ $lodash.get(student, 'user.phone') }}</td>
              <td><span class="badge badge-primary mr-1" v-for="(tag, index) in student.tags" :key="index">{{ tag }}</span></td>
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
        <v-pagination :pages="totalPages" v-on:page-changed="changePage"
              ref="paginateBot"></v-pagination>
      </div>
    </section>
  </div>
</template>
<script>
  import Paginate from 'vuejs-paginate'
  import VueTagsInput from '@johmun/vue-tags-input'
  import TagsAucompleteMixin from '../../../mixins/tags-autocomplete'

  export default {
    mixins: [TagsAucompleteMixin],
    components: {
      Paginate,
      VueTagsInput
    },
    data() {
      return {
        students: [],
        learningNodes: [],
        tag: '',
        tags: [],
        total: 0,
        totalPages: 0,
        search: {
          tags: [],
          per_page: 50,
          page: 1,
          name: null,
          email: null,
          phone: null,
          took_learning_node: null
        }
      }
    },
    methods: {
      showObjective(objective) {
        this.$modal.show('objective.show', objective)
      },
      searchStudents() {
        this.search.page = 1
        this.loadStudents()
        this.setPaginationCurrentPage()
      },
      loadStudents() {
        let params = {}
        Object.assign(params, this.search)
        params.tags = this.tags.map(tag => tag.text)
        Object.keys(params).map(key => {
          if(!params[key]) {
            params[key] = null
          }
        })

        this.axios.get('/v5/admin/students', {params: params})
          .then((res) => {
            this.students = res.data.data
            this.total = res.data.meta.pagination.total
            this.search.per_page = res.data.meta.pagination.per_page
            this.totalPages = Math.ceil(res.data.meta.pagination.total / res.data.meta.pagination.per_page)
          })
          .catch((err) => {

          })
      },
      loadLearningNodes() {
        this.axios.get('/v5/admin/learning_nodes', {params: {per_page: 9999}})
          .then((res) => {
            this.learningNodes = res.data.data;
          })
          .catch((err) => {

          })
      },
      changePage(page) {
        if(page && this.search.page != page) {
          this.search.page = page
          this.setPaginationCurrentPage()
          this.loadStudents()
        }
      },
      setPaginationCurrentPage() {
        this.$refs.paginateTop.setCurrentPage(this.search.page)
        this.$refs.paginateBot.setCurrentPage(this.search.page)
      }
    },
    mounted() {
      this.loadStudents()
      this.loadLearningNodes();
    }
  }
</script>
