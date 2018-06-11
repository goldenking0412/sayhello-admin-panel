const freqSettings = {
    lowerFreqBound: 4,
    upperFreqBound: 30,
    minPulseScale: 0.7,
    maxPulseScale: 1.3,
    pulseScaleStep: 0.005
};

class SpeakingPulse {
    constructor(stream) {
        var AudioContext = window.AudioContext || window.webkitAudioContext;
        this.context = new AudioContext();
        this.freqAnalyser = this.context.createAnalyser();
        this.freqBufferLength = this.freqAnalyser.frequencyBinCount;
        this.freqDataArray = new Uint8Array(this.freqBufferLength);
        this.source = this.context.createMediaStreamSource(stream);
        this.source.connect(this.freqAnalyser);
    }

    getPulseScale() {
        function sumArray(previousValue, currentValue) {
            return previousValue + currentValue;
        }
        this.freqAnalyser.getByteFrequencyData(this.freqDataArray);
        var sum = this.freqDataArray.reduce(sumArray);
        sum = sum / this.freqBufferLength;
        // Set outer bounds
        if (sum > freqSettings.upperFreqBound) {
            sum = freqSettings.upperFreqBound;
        }
        else if (sum < freqSettings.lowerFreqBound) {
            sum = freqSettings.lowerFreqBound;
        }

        // Normalize within min/max scale
        const normalized = (sum - freqSettings.lowerFreqBound) / freqSettings.upperFreqBound;
        const deltaScale = freqSettings.maxPulseScale - freqSettings.minPulseScale;
        const vuScaled = (deltaScale * normalized) + freqSettings.minPulseScale;

        var pulseScale = (Math.round(vuScaled / freqSettings.pulseScaleStep) * freqSettings.pulseScaleStep);
        return pulseScale;
    }

    destroy() {
        this.context.close();
        this.freqAnalyser.disconnect();
    }
}

export default SpeakingPulse;