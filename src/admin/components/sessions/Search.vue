<template>
  <div>
    <h2>Sessions</h2>
    <div class="row">
      <div class="col-sm-3">
        <div class="form-group">
          <label class="d-block">
            Of learning node
            <button type="button" class="close float-right" aria-label="Close" @click="clearNode()">
              <span aria-hidden="true">&times;</span>
            </button>
          </label>
          <input type="text" class="form-control" v-model="selectedNodeTitle" @click.prevent="openLearningNode()">
        </div>
      </div>
      <div class="col-sm-5">
        <div class="form-group">
          <label>Of student tags</label>
          <vue-tags-input
              v-model="studentTag"
              :tags="studentTags"
              @tags-changed="newTags => studentTags = newTags"
              :autocomplete-items="getAutocompleteTags(studentTag)"
            />
        </div>
      </div>
      <div class="col-sm-4">
        Status
          <select v-model="search.status" class="form-control">
            <option value="" selected></option>
            <option value="pending">Pending</option>
            <option value="started">Started</option>
            <option value="rejected">Rejected</option>
            <option value="precheck_pending">Precheck Pending</option>
            <option value="evaluation_pending">Evaluation Pending</option>
            <option value="completed">Complete</option>
          </select>
      </div>
      <div class="col-sm-3">
        <div class="form-group">
            By id
          <input type="text" class="form-control" v-model="search.id" placeholder="By session id">
        </div>
      </div>
      <div class="col-sm-3">
        <div class="form-group">
          <div>
            From
          </div>
          <date-picker v-model="search.created_from" lang="en" :first-day-of-week="1"></date-picker>
        </div>
      </div>
      <div class="col-sm-3">
        <div class="form-group">
          <div>
            To
          </div>
          <date-picker v-model="search.created_to" :not-before="search.created_from" lang="en" :first-day-of-week="1"></date-picker>
        </div>
      </div>
      <div class="col-sm-3">
        <div class="form-group">
          <div class="custom-control custom-checkbox">
            <input type="checkbox" v-model="search.has_evaluation" class="custom-control-input" id="has_evaluations">
            <label class="custom-control-label" for="has_evaluations">Has evaluations</label>
          </div>
        </div>
      </div>
      <div class="col-sm-5">
        <div class="form-group">
          <label>Of session tags</label>
          <vue-tags-input
              v-model="sessionTag"
              :tags="sessionTags"
              @tags-changed="newTags => sessionTags = newTags"
              :autocomplete-items="getAutocompleteTags(sessionTag)"
            />
        </div>
      </div>
      <div class="col-sm-6">
        <div class="form-group">
          <label>Evaluated by</label>
          <select v-model="search.evaluated_by" class="form-control">
              <option value="" selected>-- Select Evaluator --</option>
              <option v-for="user in evaluators" :key="user.id" :value="user.id">{{ user.name }}</option>
            </select>
        </div>
      </div>
    </div>
    <p class="text-right">
        <button class="btn btn-primary" @click.prevent="searchSessions()">
          Search
        </button>
    </p>
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
              <th>ID</th>
              <th>Student name</th>
              <th>Learning node</th>
              <th>Status</th>
              <th>Created at</th>
              <th>Updated at</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="session in sessions" :key="session.id">
              <td>{{ session.id }}</td>
              <td><router-link :to="{name: 'students.show', params: {id: session.student.id}}">{{ session.student.name }}</router-link></td>
              <td>{{ session.lesson.title }}</td>
              <td>{{ session.status }}</td>
              <td>{{ session.created_at | moment("DD/MM/YYYY hh:mm") }}</td>
              <td>{{ session.updated_at | moment("DD/MM/YYYY hh:mm") }}</td>
              <td>
                <button class="btn btn-sm btn-primary" @click.prevent="showSession(session.id)">
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
        <v-pagination :pages="totalPages" v-on:page-changed="changePage"
          ref="paginateBot"></v-pagination>
      </div>
    </section>
    <SessionModal/>
    <SelectLearningNode v-on:selected="selectedLearningNode" />
  </div>
</template>
<script>
  import DatePicker from 'vue2-datepicker'
  import Paginate from 'vuejs-paginate'  
  import VueTagsInput from '@johmun/vue-tags-input'
  import SessionModal from '../students/SessionModal.vue'  
  import TagsAucompleteMixin from '../../../mixins/tags-autocomplete'
  import SelectLearningNode from './SelectLearningNode.vue'

  export default {
    mixins: [TagsAucompleteMixin],
    components: {
      DatePicker,
      Paginate,
      SessionModal,
      VueTagsInput,
      SelectLearningNode
    },
    data() {
      return {
        sessions: [],
        studentTag: '',
        studentTags: [],
        sessionTag: '',
        sessionTags: [],
        total: 0,
        totalPages: 0,
        evaluators: [],
        selectedNodeTitle: null,
        search: {
          per_page: 50,
          page: 1,
          status: '',
          created_from: 0,
          created_to: 0,
          has_evaluation: true,
          evaluated_by: null
        }
      }
    },
    methods: {
      searchSessions() {
        this.search.page = 1
        this.loadSessions()
        this.setPaginationCurrentPage()
      },
      loadSessions() {
        let params = {}
        let studentTagsSearch = this.studentTags.map(tag => tag.text)
        let sessionTagsSearch = this.sessionTags.map(tag => tag.text)
        Object.assign(params, this.search)
        params.student_tags = this.studentTags.length > 0 ? studentTagsSearch : null
        params.tags = this.sessionTags.length > 0 ? sessionTagsSearch : null
        params.learning_node_id = params.learning_node_id ? params.learning_node_id : null
        params.status = params.status ? params.status : null
        params.has_evaluation = params.has_evaluation ? 1 : 0
        params.created_from = params.created_from ? params.created_from.valueOf() / 1000 : null
        params.created_to = params.created_to ? params.created_to.valueOf() / 1000 : null

        Object.keys(params).map(key => {
          if (!params[key]) {
            params[key] = null
          }
        })

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
      changePage(page) {
        if(page && this.search.page != page) {
          this.search.page = page
          this.setPaginationCurrentPage()
          this.loadSessions()
        }
      },
      setPaginationCurrentPage() {
        this.$refs.paginateTop.setCurrentPage(this.search.page)
        this.$refs.paginateBot.setCurrentPage(this.search.page)
      },
      showSession(node) {
        this.$modal.show('students.session', node)
      },
      loadEvaluators() {
        this.axios.get('/v5/admin/users', {params: { role: 'evaluator', per_page: 9999}})
          .then((res) => {
            this.evaluators = res.data.data
          })
          .catch((err) => {

          })
      },
      openLearningNode() {
        this.$modal.show('sesions.select-learning-node')
      },
      selectedLearningNode(node) {
        this.search.learning_node_id = node.id
        this.selectedNodeTitle = node.title
      },
      clearNode() {
        this.search.learning_node_id = null
        this.selectedNodeTitle = null
      }
    },
    mounted() {
      this.loadEvaluators()
      this.loadSessions()
    }
  }
</script>
