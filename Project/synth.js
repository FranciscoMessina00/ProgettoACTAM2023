const c = new AudioContext();
c.resume();
Tone.context = c;

osc_param = {
    freq : 440, 
    type : "sine", 
    modtype: "sine", 
    harm : 1.3, 
    mod : 1,
    LFOamt: 5000,
}
var global = {
    glide : 0,
    pwm : 0,
    vibrato : 0,
    position: 0,
    LFOpos: 1,
}

var filter_param = {
    cutoff: 400,
    resonance : 5,
    // keyboard_tracking : 0,
    type : 'lowpass',
    env_amount : 1,
    LFO_amount : 100,
}

var LFO = {
    waveform : 'sawtooth',
    rate : 1,
    sync : false,
}

var adsr_mix = {
    is_ar : false,
    attack : 0.5,
    decay : 0.5,
    sustain: 0.5,
    release : 2 
}

var adsr_filter = {
    is_ar : false,
    attack : 1,
    decay : 0.6,
    sustain: 0.5,
    release : 1
}



function createAmpEnv(a, d, s, r) { 
    var ampEnv = new Tone.AmplitudeEnvelope();
    ampEnv.set({
    attack: a,
    decay: d,
    sustain: s,
    release: r,
    })               
    return ampEnv;     
}

function createOscillator(freq, type, modtype, harm, mod) {
    var fmOsc = new Tone.FMOscillator();
    fmOsc.set({
        frequency: freq,
        type: type,
        modulationType: modtype,
        harmonicity: harm,
        modulationIndex: mod,
    })
    return fmOsc;
}

function createFilter(freq, Q, type){
    var filter = new Tone.Filter()
    filter.set({
        frequency : freq,
        Q : Q,
        type : type,
    })
    return filter;
}



function createFilterEnv(a, d, s, r) {
    return FilterEnv = new Tone.Envelope({
    attack: a,
    decay: d,
    sustain: s,
    release: r,
    }); 
}

function createLFO(frequency, min, max) {
    return LFO = new Tone.LFO({
        frequency: frequency,
        min: min,
        max: max,
    });
}

var filter = createFilter(filter_param.cutoff, filter_param.resonance, filter_param.type);
var ampEnv = createAmpEnv(adsr_mix.attack,adsr_mix.decay,adsr_mix.sustain,adsr_mix.release);
var oscillator = createOscillator(osc_param.freq, osc_param.type, osc_param.modtype, osc_param.harm, osc_param.mod);


var EnvFilterAmount = new Tone.Gain(filter_param.env_amount);
var filterEnv = createFilterEnv(adsr_filter.attack,adsr_filter.decay,adsr_filter.sustain,adsr_filter.release);
var LFO = new Tone.Oscillator(LFO.rate, LFO.waveform);
//var pan = new Tone.Panner(global.position);
var LFOfiltAmt = new Tone.Gain(filter_param.LFO_amount);
var LFOModFm = new Tone.Gain(osc_param.LFOamt);
//var LFOpan = new Tone.Gain(global.LFOpos);


oscillator.chain(ampEnv, filter, pan);
filterEnv.chain(EnvFilterAmount, filter.frequency);
LFO.chain(LFOfiltAmt, filter.frequency);
LFO.chain(LFOModFm, oscillator.modulationIndex);
//LFO.chain(LFOpan, pan.pan);

LFO.start();
oscillator.start();
    


