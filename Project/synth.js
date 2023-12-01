const c = new AudioContext();
c.resume();
Tone.context = c;

osc_param = {
    freq : 440, 
    type : "sine", 
    modtype: "sine", 
    harm : 1.3, 
    mod : 1,
    LFOamt: 1000,
}
var global = {
    glide : 0,
    pwm : 0,
    vibrato : 0,
    position: 0,
    //LFOpos: 1,
}

var filter_param = {
    cutoff: 3000,
    resonance : 0,
    // keyboard_tracking : 0,
    type : 'lowpass',
    env_amount : 0,
    LFO_amount : 0,
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

function createOscillator(osc_param) {
    var fmOsc = new Tone.FMOscillator();
    var LFOModFm = new Tone.Gain(osc_param.LFOamt);
    fmOsc.set({
        frequency: osc_param.freq,
        type: osc_param.type,
        modulationType: osc_param.modtype,
        harmonicity: osc_param.harm,
        modulationIndex: osc_param.mod,
    })
    return {
        fmOsc: fmOsc,
        LFOModFm: LFOModFm};
}

function createFilter(filter_param, adsr_filter){
    var filter = new Tone.Filter()
    filter.set({
        frequency : filter_param.cutoff,
        Q : filter_param.resonance,
        type : filter_param.type,
    })
    var env = createFilterEnv(adsr_filter.attack,adsr_filter.decay,adsr_filter.sustain,adsr_filter.release);
    var envAmount = new Tone.Gain(filter_param.env_amount);
    var LFOAmt = new Tone.Gain(filter_param.LFO_amount);
    
    return {
        filter: filter,
        env: env, 
        envAmount: envAmount, 
        LFOAmt: LFOAmt};
}



function createFilterEnv(a, d, s, r) {
    return FilterEnv = new Tone.Envelope({
    attack: a,
    decay: d,
    sustain: s,
    release: r,
    });

}

function createLFO(LFO) {
    return LFO = new Tone.Oscillator({
        frequency: LFO.rate,
        waveform: LFO.waveform,
    });
}

var filter = createFilter(filter_param, adsr_filter);
var ampEnv = createAmpEnv(adsr_mix.attack,adsr_mix.decay,adsr_mix.sustain,adsr_mix.release);
var oscillator = createOscillator(osc_param);

var LFO = createLFO(LFO);
//var pan = new Tone.Panner(global.position);
//var LFOpan = new Tone.Gain(global.LFOpos);


oscillator.fmOsc.chain(ampEnv, filter.filter, Tone.Destination);
filter.env.chain(filter.envAmount, filter.filter.frequency);
LFO.chain(filter.LFOAmt, filter.filter.frequency);
LFO.chain(oscillator.LFOModFm, oscillator.fmOsc.modulationIndex);
//LFO.chain(LFOpan, pan.pan);

LFO.start();
oscillator.fmOsc.start();
    


