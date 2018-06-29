<template>
  <div>
      <p v-if="noResult" class="text-center text-danger">
          No sessions to precheck
      </p>

    <div v-if="session">
      <h2>Precheck</h2>
      <p>
        Student: <strong>{{ session.student.id }}</strong><br>
        Session: <strong>{{ session.id }}</strong>
      </p>
      <hr>
      <BlocksContainer v-bind:blocks="session.lesson.blocks" />
      <div class="text-center mt-4">
        <button class="btn btn-success" @click="setStatus(true)">Approve</button>
        <button class="btn btn-danger ml-1" @click="setStatus(false)">Reject</button>
      </div>
    </div>
  </div>
</template>
<script>
import {Howl, Howler} from 'howler'
import AudioRecorder from './helpers/AudioRecorder'
import {getRatingScaleData} from './helpers/RatingScalesHelper'
import BlocksContainer from '../../../commons/blocks/BlocksContainer.vue'

export default {
    data() {
      return {
        processing: false,
        noResult: false,
        session: null
      }
    },
    created() {
        this.reload();
    },
    components: { BlocksContainer },
    methods: {
        reload() {
            this.axios.get('/v5/me/lesson_to_precheck')
                .then((res) => {
                    this.session = res.data.session
                }, (error) => {
                    if (error.response.status == 404) {
                        this.noResult = true;
                    }
                });
        },
        setStatus(status) {
            if (status === false && !confirm("Are you about REJECTing this session?")) {
                return;
            }

            let payload = {
              prechecked_status: status
            };

            this.axios.post('/v5/students/learning_nodes/' + this.session.id + '/precheck', payload).then(() => {
                this.reload();
            });
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
