<template>
    <div>
        <p class="text-center text-danger" v-if="noEvaluation">
            No sessions to evaluate
        </p>
        <div v-if="evaluation">
            <h6>Student</h6>
            <h3>{{ evaluation.session.student.name }}</h3>
            <h3><small>{{ evaluation.session.student.id }}</small></h3>
            <hr>
            <h4>{{ evaluation.lesson.title }}</h4>
            <p>{{ evaluation.lesson.description.en }}</p>
            <hr>
            <div v-for="(block, blockIndex) in evaluation.session.lesson.blocks" class="card">
                <div class="card-body">
                    <h4>{{ block.question.en }}</h4>
                    <button v-if="activeAudioIndex !== blockIndex" class="btn btn-primary" @click="playAudio(blockIndex)">Play</button>
                    <button v-if="activeAudioIndex === blockIndex" class="btn btn-danger" @click="stopAudio()">Stop</button>
                    <hr>
                    <div
                        v-for="(blockEvaluateObj, blockEvaluateObjIndex) in block.evaluatable_objectives">
                        <h5 class="text-info">{{ $lodash.get(blockEvaluateObj, 'evaluation_config.question') }}</h5>

                        <div style="margin-bottom: 10px" v-if="blockEvaluateObj.rating_scale == 'Criteria.RatingScale.OneFive'">
                            <star-rating v-model="blockEvaluateObj.rating"></star-rating>
                        </div>

                        <div v-if="blockEvaluateObj.rating_scale == 'Criteria.RatingScale.YesNo'">
                            <yes-no v-model="blockEvaluateObj.condition_met"></yes-no>
                        </div>

                        <div v-if="blockEvaluateObj.rating_scale == 'Criteria.RatingScale.MultipleChoice'">
                            <multiple-choice v-model="blockEvaluateObj.choice" :choices="blockEvaluateObj.evaluation_config.choices"></multiple-choice>
                        </div>
                    </div>
                </div>
            </div>
            <hr>
            <h2 class="text-center">Overall Feedback</h2>
            <div
                v-for="(evaluateObj, evaluateObjIndex) in learningObjectives">
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
                    <div class="text-center">
                        <button class="btn btn-success" v-if="!isRecording" @click="startRecording()">Start Recording</button>
                        <button class="btn btn-danger" v-if="isRecording" @click="stopRecording()">Stop Recording</button>
                        <button class="btn btn-warning" v-if="recordedAudio && !isRecording" @click="playRecorded()">Play Recorded</button>
                    </div>

                    <hr>
                    <label>Notes on this student</label>
                    <p class="text-muted">Share your thoughts on the student and reasoning behind your evaluation. Will be shared with the student.</p>
                    <textarea v-model="generalFeedback.feedback_notes" cols="30" rows="3" class="form-control"></textarea>
                    <br>
                    <label>Suggestions to improve spoken english</label>
                    <textarea v-model="generalFeedback.feedback_suggestions" cols="30" rows="3" class="form-control"></textarea>
                </div>
            </div>
            <hr>
            <p class="text-danger"><span v-if="error">An error occurred, make sure all fields are filled ({{error}}).</span></p>
            <p class="text-muted"><span v-if="processing">Please wait.</span></p>

            <button class="btn btn-primary" @click="submit()">Submit</button>
        </div>
    </div>
</template>
<script>


import {Howl, Howler} from 'howler'
import YesNo from './RatingScale/YesNo'
import MultipleChoice from './RatingScale/MultipleChoice'
import StarRating from 'vue-star-rating'
import AudioRecorder from './helpers/AudioRecorder'
import {getRatingScaleData} from './helpers/RatingScalesHelper'

export default {

    data() {
        return {
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
            error: false
        }
    },
    created() {

        this.evaluation = false;
        this.axios.get('/v5/me/lesson_to_evaluate')
            .then((res) => {
                this.evaluation = res.data;
                this.learningObjectives = this.evaluation.lesson.evaluatable_objectives;

                this.learningObjectives.forEach((obj) => {
                    //TODO: hardcoding the logic
                    if (obj.rating_scale == "Criteria.RatingScale.GeneralFeedback") {
                        this.hasGeneralFeedback = true;
                    }
                });

            }, (error) => {
                if (error.response.status == 404) {
                    this.noEvaluation = true;
                }
            });
        
    },
    components: {
      StarRating,
      MultipleChoice,
      'yes-no': YesNo
    },
    methods: {
        playAudio(index) {
            if (this.activeAudio)
                this.activeAudio.stop();

            let url = this.evaluation.session.lesson.blocks[index].answer.audio;

            this.activeAudioIndex = index;
            this.activeAudio = new Howl({src: [url]});
            this.activeAudio.on("end", () => {
                this.stopAudio();
            });
            this.activeAudio.play();
        },
        stopAudio() {
            if (this.activeAudio)
                this.activeAudio.stop();
            this.activeAudioIndex = false;
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

            this.evaluation.session.lesson.blocks.forEach((block) => {
                block.evaluatable_objectives.forEach((lo) => {
                    let ratingScaleData = getRatingScaleData(lo, lo.rating_scale);

                    if (ratingScaleData !== false) {
                        payload.block_evaluations.push({
                            objective_id: lo.objective_id,
                            block_id: block.block_id,
                            response_id: block.response_id,
                            data: ratingScaleData
                        });
                    }
                });
            });
            
            this.axios.post('/v5/students/learning_nodes/' + this.evaluation.session.id + '/evaluate', payload).then(() => {
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

            let s = new Howl({
                src: [this.recordedAudio.url],
                format: ["wav"]
            });

            s.on("end", () => {
                console.log("done");
            });

            s.play();
        },
        reload() {
            this.stopAudio();
            //reloading to clear data completely
            this.$router.go(this.$router.currentRoute);
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