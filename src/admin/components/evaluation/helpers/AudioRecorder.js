import _ from 'lodash';
import SpeakingPulse from './SpeakingPulse.js'
import RecordRTC from 'recordrtc'
let parser = require('ua-parser-js');
let ua = parser(navigator.userAgent);

let audioOption = {
    type: 'audio',
    mimeType: 'audio/wav',
    bufferSize: 0,
    sampleRate: 44100,
    leftChannel: false,
    disableLogs: false,
    audioStream: false
    //recorderType: RecordRTC.StereoAudioRecorder,
};

if ((/Chrome/i.test(ua.browser.name))) {
    audioOption.mimeType = 'audio/webm';
}

function captureUserMedia(mediaConstraints, successCallback, errorCallback) {
    if (typeof _.get(navigator, 'mediaDevices.getUserMedia') == "function") {
        navigator.mediaDevices.getUserMedia(mediaConstraints).then(successCallback).catch(errorCallback);
        return true;
    }

    if (!!(navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia)) {
        navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
        navigator.getUserMedia(mediaConstraints, successCallback, errorCallback);
        return true;
    }
    return false;
}

export default class {
    constructor() {
        this.audioStream   = false;
        this.speakingPulse = false;
        this.recordRTC     = false;
    }

    getOptions() {
        return audioOption;
    }

    startMic() {

        if (this.audioStream) {
            return new Promise((resolve, reject) => {
                resolve();
            });
        }

        return new Promise((resolve, reject) => {
            let handleAudioStream = (stream) => {
                this.audioStream    = stream;
                this.speakingPulse  = new SpeakingPulse(stream);
                this.recordRTC      = RecordRTC(this.audioStream, audioOption);
                resolve();
            };

            let captureMediaStatus = captureUserMedia({"audio": true}, handleAudioStream, (reason) => {
                reject({reason: reason});
            });

            if (!captureMediaStatus)
                reject({reason: "mic_not_supported"});
        });
    }

    stopMic() {
        if (this.audioStream)
            this.audioStream.stop();

        this.audioStream = false;
    }

    getPulseScale() {
        if (this.speakingPulse)
            return this.speakingPulse.getPulseScale();
        else
            return 0;
    }

    startRecording() {
        if (!this.audioStream)
            throw new Error("microphone_not_started");

        this.recordRTC.startRecording();
        console.log(this.recordRTC);
    }

    stopRecording() {
        if (this.recordRTC) {
            
            return new Promise((resolve, reject) => {
                this.recordRTC.stopRecording((audioURL) => {
                    this.recordRTC.getDataURL((dataURL) => { 
                        resolve({
                            url: audioURL,
                            data: dataURL
                        });
                    }); 
                });
            });
        } else {
            throw new Error("Recording session is not started");
        }
    }

    destroy() {
        this.speakingPulse.destroy();
        this.recordRTC.destroy();
    }
}