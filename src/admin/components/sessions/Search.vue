<template>
  <div>
    <h2>Sessions</h2>
    <div class="row">
      <div class="col-sm-3">
        <div class="form-group">
          Of learning node
            <select v-model="search.learning_node_id" class="form-control">
              <option value="" selected></option>
              <option v-for="node in learningNodes" :key="node.id" :value="node.id">{{ node.title }}</option>
            </select>
        </div>
      </div>
      <div class="col-sm-5">
        <div class="form-group">
          <label>Of student tags</label>
          <vue-tags-input
              v-model="tag"
              :tags="tags"
              @tags-changed="newTags => tags = newTags"
            />
        </div>
      </div>
      <div class="col-sm-4">
        Status
          <select v-model="search.status" class="form-control">
            <option value="" selected></option>
            <option value="pending">Pending</option>
            <option value="rejected">Rejected</option>
            <option value="evaluation_pending">Evaluation Pending</option>
            <option value="completed">Complete</option>
          </select>
      </div>
      <div class="col-sm-4 offset-md-8">
        <div class="form-group">
          <div class="custom-control custom-checkbox">
            <input type="checkbox" v-model="search.has_evaluation" class="custom-control-input" id="has_evaluations">
            <label class="custom-control-label" for="has_evaluations">Has evaluations</label>
          </div>
        </div>
      </div>
    </div>
    <p class="text-right">
        <button class="btn btn-primary" @click.prevent="loadSessions()">
          Search
        </button>
    </p>
    <section class="section">
      <div class="table-responsive">
        <table class="table table-striped">
          <thead>
            <tr>
              <th>Student name</th>
              <th>Learning node</th>
              <th>Status</th>
              <th>Created at</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="session in sessions" :key="session.id">
              <td><router-link :to="{name: 'students.show', params: {id: session.student.id}}">{{ session.student.name }}</router-link></td>
              <td>{{ session.lesson.title }}</td>
              <td>{{ session.status }}</td>
              <td>{{ session.created_at | moment("DD/MM/YYYY hh:mm") }}</td>
              <td>
                <button class="btn btn-sm btn-primary" @click.prevent="showSession(session)">
                  View
                </button>
              </td>
            </tr>
            <tr v-if="!sessions.length">
              <td colspan="5">
                Not found any sessions
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
    <SessionModal/>
  </div>
</template>
<script>
  import Paginate from 'vuejs-paginate'  
  import VueTagsInput from '@johmun/vue-tags-input'
  import SessionModal from '../students/SessionModal.vue'  

  export default {
    components: {
      Paginate,
      SessionModal,
      VueTagsInput
    },
    data() {
      return {
        sessions: [],
        learningNodes: [],
        tag: '',
        tags: [],
        total: 0,
        totalPages: 0,
        search: {
          per_page: 50,
          page: 1,
          status: '',
          has_evaluation: true
        }
      }
    },
    methods: {
      loadSessions() {
        let params = {}
        let tagsSearch = this.tags.map(tag => tag.text)
        console.log(this.tags.length > 0)
        Object.assign(params, this.search)
        params.student_tags = this.tags.length > 0 ? tagsSearch : null
        params.learning_node_id = params.learning_node_id ? params.learning_node_id : null
        params.status = params.status ? params.status : null
        params.has_evaluation = params.has_evaluation ? 1 : 0
        console.log(this.search)
        this.axios.get('/v5/admin/sessions', { params })
        .then((res) => {
          this.sessions = res.data.data
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
        if(page && this.search.page != page) {
          this.search.page = page
          this.loadSessions()
        }
      },
      showSession(node) {
        this.$modal.show('students.session', node)
      }
    },
    mounted() {
      this.loadSessions()
      this.loadLearningNodes()
    }
  }
</script>
