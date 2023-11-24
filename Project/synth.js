const c = new AudioContext();
c.resume();

var o_global = {
    glide : 0,
    pwm : 0,
    vibrato : 0
}

var osc1_param = {
    waveform : 'sine',
    is_square : false,
    duty_cycle : 50,
}

var osc1_param = {
    waveform : 'sine',
    is_square : false,
    duty_cycle : 50,
    octave : 0,
    detune : 0 
}

var noise_cutoff = 20000;

var mixer = {
    g_o1 : 0,
    g_o2 : 0,
    g_noise : 0
}

var filter_param = {
    cutoff: 20000,
    resonance : 0,
    // keyboard_tracking : 0,
    type : 'lowpass',
    env_amount : 0,
    LFO_amount : 0
}

var LFO = {
    waveform : 'sine',
    rate : 2,
    sync : false,
}

var adsr_mix = {
    is_ar : false,
    attack : 0.01,
    decay : 0.01,
    sustain: 0.5,
    release : 0.1 
}

var adsr_filter = {
    is_ar : false,
    attack : 0.01,
    decay : 0.01,
    sustain: 0.5,
    release : 0.1 
}



function createAmpEnv(a, d, s, r) {                
    return ampEnv = new Tone.AmplitudeEnvelope({
    attack: a,
    decay: d,
    sustain: s,
    release: r,
    }).connect(filter);     
}

function createOscillator(freq, type, modtype, harm, mod) {
    return fmOsc = new Tone.FMOscillator({
    frequency: freq,
    type: type,
    modulationType: modtype,
    harmonicity: harm,
    modulationIndex: mod,
    }).connect(ampEnv);
}

function createFilter(freq, Q, type){
    return filter = new Tone.BiquadFilter({
        frequency : freq,
        Q : Q,
        type : type
    }).toDestination();
        // filter.frequency = freq;
        // filter.Q = Q
        // filter.type = type
        // return filter;
}



var filter = createFilter(filter_param.cutoff, filter_param.Q, filter_param.type);
var ampEnv = createAmpEnv(adsr_filter.attack,adsr_filter.decay,adsr_filter.sustain,adsr_filter.release);
// ampEnv.connect(filter)
// filter.connect(c.destination);


// var gain = c.createGain();

// filter.connect(ampEnv);
// gain.connect(c.destination);


function createOscillator(freq, type, modtype, harm, mod) {
    return fmOsc = new Tone.FMOscillator({
    frequency: freq,
    type: type,
    modulationType: modtype,
    harmonicity: harm,
    modulationIndex: mod
    }).connect(ampEnv);
}
