<template>
  <div>
    <p class="text-center text-danger" v-if="!session && !loadingSession">
      No sessions to evaluate
    </p>
    <p class="text-center text-info" v-if="loadingSession">
      Looking for a session to evaluate
    </p>
    
    <div v-if="session">
      <div class="row">
        <div class="col-6">
          <h2>Evaluate</h2>
        </div>
        <div class="col-6 text-right">
          <button class="btn btn-primary" @click="viewStudent()">View Student</button>&nbsp;
          <button class="btn btn-secondary" @click="skipAndLoad()">Skip</button>
        </div>
      </div>
      <hr>
      <h3>
        {{ session.student.name }}
        <small>
            <span class="badge badge-primary mr-1" v-for="(tag, index) in session.student.tags" :key="index">{{ tag }}</span>
            <span class="badge badge-warning" v-if="isPaid">Paid</span>
        </small>
        </h3>
      <h4>{{ session.lesson.title }}</h4>
      <div>
          <span class="badge badge-primary mr-1" v-for="(tag, index) in session.lesson.tags" :key="index">{{ tag }}</span>
      </div>
      <hr>
      <p>
        Student: <strong>{{ session.student.id }}</strong><br>
        Session: <strong>{{ session.id }}</strong>
      </p>
      <BlocksContainer v-bind:blocks="session.lesson.blocks" />
        <hr>
          <h2 class="text-center">Overall Feedback</h2>
          <div v-for="(evaluateObj, evaluateObjIndex) in learningObjectives">
              <h5 v-if="evaluateObj.rating_scale != 'Criteria.RatingScale.GeneralFeedback'"class="text-info">{{ $lodash.get(evaluateObj, 'title') }}</h5>
              <pre v-if="evaluateObj.rating_scale != 'Criteria.RatingScale.GeneralFeedback'">{{ $lodash.get(evaluateObj, 'evaluation_config.question') }}</pre>

              <div style="margin-bottom: 10px" v-if="evaluateObj.rating_scale == 'Criteria.RatingScale.OneFive'">
                  <star-rating v-model="evaluateObj.rating"></star-rating>
              </div>

              <div v-if="evaluateObj.rating_scale == 'Criteria.RatingScale.YesNo'">
                  <yes-no v-model="evaluateObj.condition_met"></yes-no>
              </div>

              <div v-if="evaluateObj.rating_scale == 'Criteria.RatingScale.MultipleChoice'">
                  <multiple-choice v-model="evaluateObj.choice" :choices="evaluateObj.evaluation_config.choices"></multiple-choice>
              </div>
          </div>
          <hr>
          <div style="width:100px;margin:auto;height:120px;">
              <div class="recording-indicator-wrapper" v-if="isRecording">
                  <div v-bind:style="{ transform: `scale(${audioPulse})`}" class="h5p-audio-recorder-vu-meter"></div>
              </div>
          </div>
          
            <div class="card" v-if="hasGeneralFeedback">
                <div class="card-body">
                    <p class="text-info text-center"><strong>Greet student by name "{{ session.student.name }}"</strong></p>
                    <hr>
                    <div class="text-center">
                        <button class="btn btn-success" v-if="!isRecording && !isAudioPlaying" @click="startRecording()">
                            Start Recording
                        </button>
                        <button class="btn btn-danger" v-if="isRecording" @click="stopRecording()">
                            Stop Recording
                        </button>
                        <button class="btn btn-warning" v-if="recordedAudio && !isRecording && !isAudioPlaying" @click="playRecorded()">
                            Play Recorded
                        </button>
                        <button class="btn btn-danger" v-if="isAudioPlaying" @click="stopAudio()">
                            Stop
                        </button>
                    </div>
                    <div class="text-center">
                        or upload an audio file<br>
                        <input type="file" class="form-control-file" @change="contentFromFile">
                    </div>

                    <hr>
                    <label>Notes on this student</label>
                    <p class="text-muted">Share your thoughts on the student and reasoning behind your evaluation. Will be shared with the student.</p>
                    <textarea v-model="generalFeedback.feedback_notes" cols="30" rows="3" class="form-control"></textarea>
                    <br>
                    <label>Suggestions to improve spoken english</label>
                    <textarea v-model="generalFeedback.feedback_suggestions" cols="30" rows="3" class="form-control"></textarea>
                </div>
            </div> <!-- general feedback -->

          <hr>
          <p class="text-danger"><span v-if="error">An error occurred, make sure all fields are filled ({{error}}).</span></p>
          <p class="text-muted"><span v-if="processing">Please wait.</span></p>
        <div class="text-center">
          <button class="btn btn-primary" @click="submit()">Submit</button>
        </div>
      </div>
      <StudentModal />
    </div>
</template>

<script>
import URI from 'urijs'
import {Howl, Howler} from 'howler'
import YesNo from './RatingScale/YesNo'
import MultipleChoice from './RatingScale/MultipleChoice'
import StarRating from 'vue-star-rating'
import AudioRecorder from './helpers/AudioRecorder'
import {getRatingScaleData} from './helpers/RatingScalesHelper'
import BlocksContainer from '../../../commons/blocks/BlocksContainer.vue'
import StudentModal from '../students/StudentModal.vue'

export default {
  data() {
    return {
      session: null,
      loadingSession: false,
      evaluation: false,
      noEvaluation: false,
      processing: false,
      activeAudio: false,
      activeAudioIndex: false,
      learningObjectives: [],
      recorder: false,
      audioPulse: 0,
      recordedAudio: false,
      pulseQuery: false,
      hasGeneralFeedback: false,
      isRecording: false,
      generalFeedback: {feedback_notes:"", feedback_suggestions:""},
      error: false,
      isAudioPlaying: false,
      isPaid: false,
      loadingFile: false,
      sessionsToSkip: []
    }
  },
    created() {
        let apiUrl = '/v5/me/lesson_to_evaluate';
        let params = {};

        if (this.$lodash.has(this.$route.query, "skip_sessions[]")) {
            let sessionIds = this.$route.query["skip_sessions[]"];

            if (typeof sessionIds == "string") {
                sessionIds = [sessionIds];
            }
            
            params.skip_sessions = sessionIds;
            this.sessionsToSkip = sessionIds;
        }

        this.session = null;
        this.loadingSession = true;

        this.axios.get(apiUrl, {params:params})
          .then((res) => {
              this.loadingSession = false;
              this.session = res.data.session
              this.learningObjectives = res.data.session.lesson.evaluatable_objectives

              if (this.$lodash.includes(this.session.student.tags, "type:paid")) {
                  this.isPaid = true;
              }

              this.learningObjectives.forEach((obj) => {
                  if (obj.rating_scale == "Criteria.RatingScale.GeneralFeedback") {
                      this.hasGeneralFeedback = true;
                  }
              });
            }, (error) => {
              this.loadingSession = false;
            });

    },
    components: {
      StarRating,
      MultipleChoice,
      'yes-no': YesNo,
      BlocksContainer, StudentModal
    },
    methods: {
        skipAndLoad() {
            if (confirm("Are you sure about skipping this session?")) {
                this.sessionsToSkip.push(this.session.id);
                this.reload();
            }
        },
        contentFromFile(ev) {
            this.loadingFile = true;
            const file = ev.target.files[0];

            var reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                this.loadingFile = false;
                this.recordedAudio = {data:reader.result};
            };
            reader.onerror = (error) => {
                this.loadingFile = false;
                alert('Error: ', error);
            };
        },
        viewStudent() {
            this.$modal.show('students.show', this.session.student.id)
        },
        playAudio(index) {
            if (this.activeAudio)
                this.activeAudio.stop();

            let url = this.session.lesson.blocks[index].answer.audio;

            this.activeAudioIndex = index;
            this.activeAudio = new Howl({src: [url]});
            this.activeAudio.on("end", () => {
                this.stopAudio();
            });
            this.isAudioPlaying = true;
            this.activeAudio.play();
        },
        stopAudio() {
            if (this.activeAudio)
                this.activeAudio.stop();
            this.activeAudioIndex = false;
            this.isAudioPlaying = false;
        },
        submit() {
            this.processing = true;

            let payload = {
                lesson_evaluations: [],
                block_evaluations: []
            };

            this.learningObjectives.forEach((lo) => {

                let ratingScaleData = getRatingScaleData(lo, lo.rating_scale);

                if (ratingScaleData !== false) {
                    payload.lesson_evaluations.push({
                        objective_id: lo.objective_id,
                        data: ratingScaleData
                    });
                }

                if (lo.rating_scale == "Criteria.RatingScale.GeneralFeedback") {
                    payload.lesson_evaluations.push({
                        objective_id: lo.objective_id,
                        data: {
                            "audio" : this.recordedAudio.data,
                            "feedback_notes" : this.generalFeedback.feedback_notes,
                            "feedback_suggestions" : this.generalFeedback.feedback_suggestions
                        }
                    });
                }
            });

            this.session.lesson.blocks.forEach((block) => {
                block.evaluatable_objectives.forEach((lo) => {
                    let ratingScaleData = getRatingScaleData(lo, lo.rating_scale);

                    if (ratingScaleData !== false && !this.$lodash.isEmpty(ratingScaleData)) {
                        payload.block_evaluations.push({
                            objective_id: lo.objective_id,
                            block_id: block.id,
                            response_id: _.get(block, 'response.id'),
                            data: ratingScaleData
                        });
                    }
                });
            });
            
            this.axios.post('/v5/students/learning_nodes/' + this.session.id + '/evaluate', payload).then(() => {
                this.reload();
            }, (error) => {
                this.processing = false;
                if (error.response.status == 422) {
                    this.error = error.response.data.errors[0];
                }
            });
        },
        startRecording() {

            if (this.recordedAudio && !confirm("Are you sure about re-recording? previous recording will be removed")) {
                return false;
            }

            this.isRecording = true;

            this.recorder = new AudioRecorder();

            this.recorder.startMic().then(() => {
                this.pulseQuery = setInterval(() => {
                    this.audioPulse = this.recorder.getPulseScale();
                }, 20);
                this.recorder.startRecording();

            })
            .catch((err) => {
                console.log(err);
            });

        },
        stopRecording() {
            this.isRecording = false;
            this.recorder.stopRecording().then((data) => {
                this.recordedAudio = data;
                this.recorder.destroy();
            });
        },
        playRecorded() {

            this.activeAudio = new Howl({
                src: [this.recordedAudio.url],
                format: ["wav"]
            });

            this.activeAudio.on("end", () => {
                this.stopAudio();
            });
            this.isAudioPlaying = true;
            this.activeAudio.play();
        },
        reload() {
            this.stopAudio();


            let url = URI(this.$router.currentRoute.path);
            url.addSearch({"skip_sessions[]": this.sessionsToSkip});
            window.location.href = url.toString();
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
