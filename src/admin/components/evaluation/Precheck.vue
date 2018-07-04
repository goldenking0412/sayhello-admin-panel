<template>
  <div>
    <p v-if="noResult" class="text-center text-danger">
      No sessions to precheck
    </p>
    <div v-if="session">
      <div class="row">
        <div class="col-6">
          <h2>Precheck</h2>
        </div>
        <div class="col-6 text-right">
          <AddTagNote v-bind:student="session.student.id" v-bind:session="session.id"/>
          <button class="btn btn-primary ml-1" @click="viewStudent()">View Student</button>
        </div>
      </div>
      <hr>
      <p>
        Student: <strong>{{ session.student.id }}</strong><br>
        Session: <strong>{{ session.id }}</strong>
      </p>
      <p>
          <span v-if="!session.student.can_communicate" class="badge badge-danger">No Communication Method</span>
          <span v-if="session.student.can_communicate" class="badge badge-success">Has Communication Method</span>
      </p>
      <hr>
      <BlocksContainer v-bind:blocks="session.lesson.blocks" />
      <div class="text-center mt-4 mb-4">
        <button class="btn btn-success" @click="approve()">Approve</button>
        <button class="btn btn-danger ml-1" @click="reject()">Reject</button>
      </div>
    </div>
    <RejectSessionModal v-on:session-rejected="reload()"/>
    <StudentModal />
  </div>
</template>
<script>
import {Howl, Howler} from 'howler'
import AudioRecorder from './helpers/AudioRecorder'
import {getRatingScaleData} from './helpers/RatingScalesHelper'
import BlocksContainer from '../../../commons/blocks/BlocksContainer.vue'
import AddTagNote from '../../../commons/AddTagNote.vue'
import RejectSessionModal from './RejectSessionModal.vue'
import StudentModal from '../students/StudentModal.vue'

export default {
    data() {
      return {
        processing: false,
        noResult: false,
        session: null
      }
    },
    mounted() {
      this.loadSession()
    },
    components: { BlocksContainer, RejectSessionModal, StudentModal, AddTagNote },
    methods: {
      viewStudent() {
        this.$modal.show('students.show', this.session.student.id)
      },
        loadSession() {
          $(document, window).scrollTop(0)
          this.session = null
          this.axios.get('/v5/me/lesson_to_precheck')
              .then((res) => {
                this.session = res.data.session
              }, (error) => {
                  if (error.response.status == 404) {
                    this.noResult = true;
                  }
              });
        },
        approve() {
          this.axios.post('/v5/students/learning_nodes/' + this.session.id + '/precheck', {
            prechecked_status: true
          }).then(() => {
              this.reload()
          });
        },
        reload() {
          this.$router.go(this.$router.currentRoute)
        },
        reject() {
          this.$modal.show('precheck.reject', this.session.id)
        }
    }
}
</script>

<style scoped>
    .recording-indicator-wrapper {
      height: 100px;
      width: 100px;
      margin-left: auto;
      margin-right: auto;
      line-height: 100px;
      color: #8e8e8e;
      position: relative;
      margin-bottom: 1em;
    }

    .h5p-audio-recorder-vu-meter {
      height: 100%;
      width: 100%;
      background-image: url('./helpers/audio-pulse.svg');
      position: absolute;
      transform: scale(0.8);

      &.hidden {
        display: none;
      }
    }
</style>
