//**********************SOUNDS**************************//
class Sound {

  constructor(context) {
    this.context = context
  }

  init() {
    this.oscillator = this.context.createOscillator()
    this.oscillatorGain = this.context.createGain()
    this.distortionGain = this.context.createGain()
    this.distortion = this.context.createWaveShaper()
  }

  makeDistortionCurve(amount) {
    var k = typeof amount === 'number' ? amount : 50,
      n_samples = 44100,
      curve = new Float32Array(n_samples),
      deg = Math.PI / 180,
      i = 0,
      x
    for ( ; i < n_samples; ++i ) {
      x = i * 2 / n_samples - 1
      curve[i] = ( 3 + k ) * x * 20 * deg / ( Math.PI + k * Math.abs(x) )
    }
    return curve;
  }

  play(value, time, howLong, distortion) {
    this.init()
    this.distortion.curve = this.makeDistortionCurve(distortion);

    this.oscillator.connect(this.oscillatorGain)
    this.oscillatorGain.connect(this.distortionGain)
    this.distortionGain.connect(this.distortion)
    this.distortion.connect(this.context.destination)

    this.oscillator.frequency.value = value
    this.oscillatorGain.gain.setValueAtTime(1, this.context.currentTime)

    this.oscillator.start(time)
    this.stop(time, howLong)
  }

  stop(time, howLong) {
    this.oscillatorGain.gain.exponentialRampToValueAtTime(0.001, time + howLong)
    this.oscillator.stop(time + howLong)
  }

}

export default Sound
