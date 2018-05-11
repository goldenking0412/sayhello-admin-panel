<template>
  <div>
    <h2>Sessions</h2>
    <div class="row">
      <div class="col-lg-2">
        <div class="form-group">
          <label>Session id</label>
          <input type="text" class="form-control" v-model="search.session_id">
        </div>
      </div>
      <div class="col-lg-2">
        <div class="form-group">
          <label>Evaluator</label>
          <input type="text" class="form-control" v-model="search.evaluator_id">
        </div>
      </div>
      <div class="col-lg-2">
        <div class="form-group">
          <label>Prechecked status</label>
          <select class="form-control" v-model="search.prechecked_status">
            <option value="1">Approved</option>
            <option value="0">Disapproved</option>
          </select>
        </div>
      </div>
      <div class="col-lg-2">
        <div class="form-group">
          <label>Evaluated</label>
          <select class="form-control" v-model="search.evaluated">
            <option value="1">Evaluated</option>
            <option value="0">Not yet</option>
          </select>
        </div>
      </div>
      <div class="col-lg-2">
        <div class="form-group">
          <label>Level</label>
          <select class="form-control" v-model="search.level">
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
      </div>
      <div class="col-lg-2">
        <div class="form-group">
          <label>Wants more</label>
          <select class="form-control" v-model="search.wants_more">
            <option value="1">Yes</option>
            <option value="0">No</option>
          </select>
        </div>
      </div>
      <div class="col-lg-2">
        <div class="form-group">
          <label>Notified evaluation</label>
          <select class="form-control" v-model="search.notified_evaluation">
            <option value="1">Sent</option>
            <option value="0">Not sent</option>
          </select>
        </div>
      </div>
      <div class="col-lg-2">
        <div class="form-group">
          <label>Played till end</label>
          <select class="form-control" v-model="search.played_till_end">
            <option value="1">Yes</option>
            <option value="0">No</option>
          </select>
        </div>
      </div>
      <div class="col-lg-2">
        <div class="form-group">
          <label>Played evaluation</label>
          <select class="form-control" v-model="search.played_evaluation">
            <option value="1">Yes</option>
            <option value="0">No</option>
          </select>
        </div>
      </div>
      <div class="col-lg-2">
        <div class="form-group">
          <label>Visited evaluation</label>
          <select class="form-control" v-model="search.visited_evaluation">
            <option value="1">Yes</option>
            <option value="0">No</option>
          </select>
        </div>
      </div>
      <div class="col-lg-2">
        <div class="form-group">
          <label>Limit</label>
          <select class="form-control" v-model="search.limit">
            <option value="50">50</option>
            <option value="100">100</option>
            <option value="200">200</option>
          </select>
        </div>
      </div>
      <div class="col-lg-2">
        <div class="form-group">
          <label>Page</label>
          <input type="number" class="form-control" v-model="search.page" min="0">
        </div>
      </div>
      <div class="col-lg-5">
        <div class="form-group">
          <label style="width: 100%">Created at</label>
          <date-picker v-model="search.created_at" lang="en" range
            type="datetime" :time-picker-options="{start: '00:00',step: '00:30',end: '23:30'}"
            format="yyyy-MM-dd  hh:mm:ss"
            >
          </date-picker>
        </div>
      </div>
      <div class="col-lg-12">
        <button @click.prevent="loadSessions()" class="btn btn-outline-primary">
          Search
        </button>
      </div>
    </div>
    <section class="section">
      <div class="table-responsive">
        <table class="table table-striped">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Phone</th>
              <th>Level</th>
              <th>Comments</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="session in sessions" :key="session.id">
              <td>{{ session.session_id }}</td>
              <td>{{ session.name }}</td>
              <td>{{ session.phone }}</td>
              <td>{{ session.level }}</td>
              <td>{{ session.comments }}</td>
            </tr>
            <tr v-if="!sessions.length">
              <td colspan="5">
                Not found any sessions
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>
</template>
<script>
  import DatePicker from 'vue2-datepicker'

  export default {
    components: {
      DatePicker
    },
    data() {
      return {
        sessions: [],
        search: {
          limit: 50,
          page: 1,
          played_till_end: 0,
          played_evaluation: 0
        }
      }
    },
    methods: {
      loadSessions() {
        this.axios.post('sessions/searches', this.search)
        .then((res) => {
          this.sessions = res.data.result
        })
        .catch((err) => {

        })
      }
    },
    mounted() {
      this.loadSessions()
    }
  }
</script>
