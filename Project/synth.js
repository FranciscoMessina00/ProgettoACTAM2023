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
    vibrato : 0,
    position: 0,
    //LFOpos: 1,
}

var filter_param = {
    cutoff: 3000, //20-20000 Hz
    resonance : 0, //0-10
    // keyboard_tracking : 0,
    type : 'lowpass',
    env_amount : 0, //0-20000
    LFO_amount : 0, //0-10000
}

var LFO = {
    waveform : 'sine',
    rate : 2, //0.1-20000 Hz
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

var flanger_param = {
    rate : 1,
    type : 'sine',
    depth: 0.003,
    feedback : 0.7,
    width : 0.5,
    dw: 0.5,
    color: 1000
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

function createFlanger(flanger_param) {

    var LFO = new Tone.Oscillator(flanger_param.rate, flanger_param.type);
    var mod = new Tone.Gain(flanger_param.width);
    var dly = new Tone.Delay(0.015, 0.030);
    var feedback = new Tone.Gain(flanger_param.feedback);
    var range_depth = new Tone.Gain(flanger_param.depth);
    var crossFade = new Tone.CrossFade(0.5);
    var dryWet = new Tone.CrossFade(flanger_param.dW);
    var overdrive = new Tone.WaveShaper(function (val) {

        var amt = flanger_param.color;
        return Math.tanh(2^(amt*val));
        }, 2048);

    crossFade.connect(dly);
    dly.connect(overdrive);
    overdrive.connect(feedback);
    feedback.connect(crossFade.b);
    dly.connect(range_depth)
    range_depth.connect(dryWet.b);
    LFO.chain(mod, dly.delayTime);
    dryWet.chain(Tone.Destination);
    LFO.start();
    return {
        crossFade: crossFade,
        dryWet: dryWet,
    }
}


var filter = createFilter(filter_param, adsr_filter);
var ampEnv = createAmpEnv(adsr_mix.attack,adsr_mix.decay,adsr_mix.sustain,adsr_mix.release);
var oscillator = createOscillator(osc_param);
var flanger = createFlanger(flanger_param);
var LFO = createLFO(LFO);
//var pan = new Tone.Panner(global.position);
//var LFOpan = new Tone.Gain(global.LFOpos);


oscillator.fmOsc.chain(ampEnv, filter.filter, flanger.crossFade.a);
filter.filter.connect(flanger.dryWet.a);
filter.env.chain(filter.envAmount, filter.filter.frequency);
LFO.chain(filter.LFOAmt, filter.filter.frequency);
LFO.chain(oscillator.LFOModFm, oscillator.fmOsc.modulationIndex);
//LFO.chain(LFOpan, pan.pan);

LFO.start();
oscillator.fmOsc.start();
    


