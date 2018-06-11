<template>
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
                    <p>{{ $lodash.get(blockEvaluateObj, 'evaluation_config.question') }}</p>

                    <div style="margin-bottom: 10px" v-if="blockEvaluateObj.rating_scale == 'Criteria.RatingScale.OneFive'">
                        <star-rating v-model="blockEvaluateObj.rating"></star-rating>
                    </div>

                    <div v-if="blockEvaluateObj.rating_scale == 'Criteria.RatingScale.YesNo'">
                        <yes-no v-model="blockEvaluateObj.condition_met"></yes-no>
                    </div>
                </div>
            </div>
        </div>
        <hr>
        <div
            v-for="(evaluateObj, evaluateObjIndex) in learningObjectives">
            <p>{{ $lodash.get(evaluateObj, 'evaluation_config.question') }}</p>

            <div style="margin-bottom: 10px" v-if="evaluateObj.rating_scale == 'Criteria.RatingScale.OneFive'">
                <star-rating v-model="evaluateObj.rating"></star-rating>
            </div>

            <div v-if="evaluateObj.rating_scale == 'Criteria.RatingScale.YesNo'">
                <yes-no v-model="evaluateObj.condition_met"></yes-no>
            </div>
        </div>
        <hr>
        <div style="width:100px;margin:auto;height:120px;">
            <div class="recording-indicator-wrapper">
                <div v-bind:style="{ transform: `scale(${audioPulse})`}" class="h5p-audio-recorder-vu-meter"></div>
            </div>
        </div>

        <button class="btn btn-success" @click="startRecording()">Start Recording</button>
        <button class="btn btn-danger" @click="stopRecording()">Stop Recording</button>
        <button class="btn btn-warning" @click="playRecorded()">Play Recorded</button>
        <hr>
        <button class="btn btn-primary" @click="submit()">Submit</button>
    </div>
</template>
<script>


import Howler from 'howler'
import YesNo from './RatingScale/YesNo'
import StarRating from 'vue-star-rating'
import AudioRecorder from './helpers/AudioRecorder'
import {getRatingScaleData} from './helpers/RatingScalesHelper'

export default {

    data() {
        return {
            evaluation: false,
            processing: false,
            activeAudio: false,
            activeAudioIndex: false,
            learningObjectives: [],
            recorder: false,
            audioPulse: 0,
            recordedAudio: false,
            pulseQuery: false
        }
    },
    created() {

        this.axios.get('/v5/me/lesson_to_evaluate')
            .then((res) => {
                this.evaluation = res.data;
                this.learningObjectives = this.evaluation.lesson.evaluatable_objectives;
            }, () => {

            });
    },
    components: {
      StarRating,
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
        setOneFiveRating(index, rating) {
            this.evaluation.lesson.evaluatable_objectives[index].rating = rating;
            console.log(this.evaluation.lesson.evaluatable_objectives[index]);
        },
        submit() {
            let payload = {
                lesson_evaluations: [],
                block_evaluations: []
            };

            this.learningObjectives.forEach((lo) => {
                let ratingScaleData = getRatingScaleData(lo, lo.rating_scale);

                if (ratingScaleData !== false) {
                    payload.lesson_evaluations.push({
                        id: lo.id,
                        data: ratingScaleData
                    });
                }
            });

            this.evaluation.session.lesson.blocks.forEach((block) => {
                block.evaluatable_objectives.forEach((lo) => {
                    let ratingScaleData = getRatingScaleData(lo, lo.rating_scale);

                    if (ratingScaleData !== false) {
                        payload.block_evaluations.push({
                            id: block.id,
                            data: ratingScaleData
                        });
                    }
                });
            });

            console.log(payload);
        },
        startRecording() {
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
            clearInterval(this.pulseQuery);
            this.recorder.stopRecording().then((data) => {
                this.recordedAudio = data;
                this.recorder.destroy();
            });
        },
        playRecorded() {
            console.log(this.recorder.getOptions().mimeType);
            let s = new Howl({
                src: [this.recordedAudio.url],
                format: ["wav"]
            });
            s.on("end", () => {
                console.log("done");
            });
            s.play();
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
