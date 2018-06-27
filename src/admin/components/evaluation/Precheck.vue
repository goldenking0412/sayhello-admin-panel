<template>
    <div>
        <p v-if="noResult" class="text-center text-danger">
            No sessions to precheck
        </p>

        <div v-if="evaluation">
            <h6>Student</h6>
            <h3>Student ID: <small>{{ evaluation.session.student.id }}</small></h3>
            <h3>Session ID: <small>{{ evaluation.session.id }}</small></h3>
            <p>
                <span class="badge badge-danger" v-if="!evaluation.session.student.can_communicate">No Communication</span>
                <span class="badge badge-success" v-if="evaluation.session.student.can_communicate">Has Communication</span>
            </p>
            <hr>
            <h4>{{ evaluation.lesson.title }}</h4>
            <hr>
            <div v-for="(block, blockIndex) in evaluation.session.lesson.blocks" class="card">
                <div class="card-body">
                    <h4>{{ block.question.en }}</h4>
                    <button v-if="activeAudioIndex !== blockIndex" class="btn btn-primary" @click="playAudio(blockIndex)">Play</button>
                    <button v-if="activeAudioIndex === blockIndex" class="btn btn-danger" @click="stopAudio()">Stop</button>
                </div>
            </div>

            <hr>
            <p class="text-center">
                <button class="btn btn-success" @click="setStatus(true)">Approve</button>
                <button class="btn btn-danger" @click="setStatus(false)">Reject</button>
            </p>


        </div>
    </div>
    
</template>
<script>


import {Howl, Howler} from 'howler'
import AudioRecorder from './helpers/AudioRecorder'
import {getRatingScaleData} from './helpers/RatingScalesHelper'

export default {

    data() {
        return {
            evaluation: false,
            processing: false,
            activeAudio: false,
            activeAudioIndex: false,
            noResult: false
        }
    },
    created() {
        this.reload();
    },
    components: {},
    methods: {
        reload() {
            this.evaluation = false;

            this.axios.get('/v5/me/lesson_to_precheck')
                .then((res) => {
                    this.evaluation = res.data;
                    this.learningObjectives = this.evaluation.lesson.evaluatable_objectives;
                }, (error) => {
                    if (error.response.status == 404) {
                        this.noResult = true;
                    }
                });
        },
        setStatus(status) {

            if (status === false && !confirm("Are you about REJECT ing this session?")) {
                return;
            }

            let payload = {
                prechecked_status: status
            };

            this.axios.post('/v5/students/learning_nodes/' + this.evaluation.session.id + '/precheck', payload).then(() => {
                this.reload();
            });
        },
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
            
            this.axios.post('/v5/students/learning_nodes/' + this.evaluation.session.id + '/evaluate', payload).then(() => {

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
