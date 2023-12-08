// const c = new AudioContext();
// c.resume();
// Tone.context = c;

// var osc_param = {
//     freq : 440, 
//     type : "sine", 
//     modtype: "sine", 
//     harm : 1.3, 
//     mod : 1,
//     LFOamt: 1000,
// }
// var global = {
//     glide : 0,
//     pwm : 0,
//     vibrato : 0,
//     position: 0,
//     //LFOpos: 1,
// }

// var filter_param = {
//     cutoff: 3000,
//     resonance : 0,
//     // keyboard_tracking : 0,
//     type : 'lowpass',
//     env_amount : 0,
//     LFO_amount : 0,
// }

// var LFO = {
//     waveform : 'sine',
//     rate : 2,
//     sync : false,
// }

// var adsr_mix = {
//     is_ar : false,
//     attack : 0.5,
//     decay : 0.5,
//     sustain: 0.5,
//     release : 2 
// }

// var adsr_filter = {
//     is_ar : false,
//     attack : 1,
//     decay : 0.6,
//     sustain: 0.5,
//     release : 1
// }
// Parameters for the synth
var filter = Synth.createFilter(filter_param, adsr_filter);
var ampEnv = Synth.createAmpEnv(adsr_mix.attack,adsr_mix.decay,adsr_mix.sustain,adsr_mix.release);
var oscillator = Synth.createOscillator(osc_param);
var LFO = Synth.createLFO(LFO);
// Connections
oscillator.fmOsc.chain(ampEnv, filter.filter, Tone.Destination);
filter.env.chain(filter.envAmount, filter.filter.frequency);
LFO.chain(filter.LFOAmt, filter.filter.frequency);
LFO.chain(oscillator.LFOModFm, oscillator.fmOsc.modulationIndex);
// Start
LFO.start();
oscillator.fmOsc.start();