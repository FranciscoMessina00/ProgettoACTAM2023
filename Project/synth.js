const c = new AudioContext();
c.resume();

var o_global = {
    glide : 0,
    pwm : 0,
    vibrato : 0
}

var filter_param = {
    cutoff: 200,
    resonance : 7,
    // keyboard_tracking : 0,
    type : 'lowpass',
    env_amount : 1000,
    LFO_amount : 1000,
}

var LFO = {
    waveform : 'sine',
    rate : 2,
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
var oscillator = createOscillator(440, "sine", "triangle", 2.7, 1);


var EnvFilterAmount = new Tone.Gain(filter_param.env_amount);
var filterEnv = createFilterEnv(adsr_filter.attack,adsr_filter.decay,adsr_filter.sustain,adsr_filter.release);
var LFO = createLFO(LFO.frequency, filter_param.cutoff, filter_param.LFO_amount);

oscillator.chain(ampEnv, filter, Tone.Destination);
filterEnv.chain(EnvFilterAmount, filter.frequency);
LFO.connect(filter.frequency);

LFO.start();
oscillator.start();
    


