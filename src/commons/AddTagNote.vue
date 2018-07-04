<template>
  <div style="display: inline">
    <modal class="commonModal" name="students.tags" style="z-index: 9999;" @before-open="loadStudentTag">
        <h4 class="p-3">Student Tags</h4>
        <div class="row">
          <div class="col-md-12">
            <vue-tags-input
              style="max-width: none;"
              v-model="studentTag"
              :tags="studentTags"
              @tags-changed="newTags => studentTags = newTags"
              :autocomplete-items="studentTagsHints"
              :add-only-from-autocomplete="true"
            />
          </div>
          <div class="col-md-12 pull-right" style="padding-top: 15px; text-align: right;">
            <button class="btn btn-danger" style="margin: 5px;" @click="closeStudentModal">
              cancel
            </button>
            <button class="btn btn-primary" @click="saveStudentTags">
              save
            </button>
          </div>
        </div>
        <loading v-if="loadingStudentTags"/>
      </modal>
    <modal class="commonModal" name="sessions.tags" style="z-index: 9999;">
      <h4 class="p-3">Session Tags</h4>
      <div class="row">
        <div class="col-md-12">
          <vue-tags-input
            style="max-width: none;"
            v-model="sessionTag"
            :tags="sessionTags"
            @tags-changed="newTags => sessionTags = newTags"
            :autocomplete-items="sessionTagsHints"
            :add-only-from-autocomplete="true"
          />
        </div>
        <div class="col-md-12 pull-right" style="padding-top: 15px; text-align: right;">
          <button class="btn btn-danger" style="margin: 5px;" @click="closeSessionModal">
            cancel
          </button>
          <button class="btn btn-primary" @click="saveSessionTags">
            save
          </button>
        </div>
      </div>
      <loading v-if="loadingSessionTags"/>
    </modal>
    <div class="dropdown" style="display: inline">
      <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
        Add Tag/Notes
      </button>
      <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
        <a class="dropdown-item" @click.prevent="openStudentModal" style="cursor: pointer;">Student</a>
        <a class="dropdown-item" @click.prevent="openSessionModal" style="cursor: pointer;">Session</a>
      </div>
    </div>
  </div>
</template>
<script>
import VueTagsInput from '@johmun/vue-tags-input'

export default {
  props: ['student', 'session'],
  components: {
    VueTagsInput
  },
  data() {
    return {
      loadingStudentTags: false,
      loadingSessionTags: false,
      studentTags: [],
      studentTagsHints: [],
      studentTag: '',
      sessionTagsHints: [],
      sessionTags: [],
      sessionTag: ''
    }
  },
  methods: {
    saveStudentTags () {
      this.axios.put('/v5/admin/students/' + this.student, {
        tags: this.studentTags.map(tag => tag.text)
        }).then((res) => {
          this.$modal.hide('students.tags')
        }).catch((res) => {
          this.$modal.hide('students.tags')
        })
    },
    loadStudentTag() {
      this.loadingStudentTags = true
      this.studentTags = []
      this.axios.get('/v5/admin/students/' + this.student)
        .then((res) => {
          this.loadingStudentTags = false
          this.studentTags = res.data.data.tags.map(tag => { return {text: tag, tiClasses: ['valid']} })
        }).catch((res) => {
          this.loadingStudentTags = false
        })
    },
    loadStudentTagHints() {
      this.studentTagsHints = []
      this.axios.get('/v5/admin/tags', {params: {search: this.studentTag, context: 'Student'}})
        .then((res) => {
          this.studentTagsHints = res.data.tags.map(tag => { return {text: tag, tiClasses: ['valid']} })
        }).catch((res) => {
        })
    },
    saveSessionTags () {
      this.axios.put('/v5/admin/sessions/' + this.session, {
        tags: this.sessionTags.map(tag => tag.text)
        }).then((res) => {
          this.$modal.hide('sessions.tags')
        }).catch((res) => {
          this.$modal.hide('sessions.tags')
        })
    },
    loadSessionTagHints() {
      this.sessionTagsHints = []
      this.axios.get('/v5/admin/tags', {params: {search: this.sessionTag, context: 'Session'}})
        .then((res) => {
          this.sessionTagsHints = res.data.tags.map(tag => { return {text: tag, tiClasses: ['valid']} })
        }).catch((res) => {
        })
    },
    openStudentModal() {
      this.$modal.show('students.tags');
    },
    openSessionModal() {
      this.$modal.show('sessions.tags');
    },
    closeStudentModal() {
      this.$modal.hide('students.tags');
    },
    closeSessionModal() {
      this.$modal.hide('sessions.tags');
    }
  },
  watch: {
    studentTag () {
      this.loadStudentTagHints()
    },
    sessionTag () {
      this.loadSessionTagHints()
    }
  }
}
</script>
