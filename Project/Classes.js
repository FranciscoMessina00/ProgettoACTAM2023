class Sequencer{
    constructor(){
        this.channel = 0;
        this.steps = [
                        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
                    ];
        this.selected = 0;
        this.playing = false;
        this.stepPlaying = 0;
    }
    setChannel(channel){
        if(channel < 0){
            this.channel = 3;
        } else if(channel > 3){
            this.channel = 0;
        } else {
            this.channel = channel;
        }
    }
    getChannel(){
        return this.channel;
    }
    triggerStep(step){
        this.steps[this.channel][step] = 1 - this.steps[this.channel][step];
    }
    getChannelSteps(){
        return this.steps[this.channel];
    }
    getAllSteps(){
        return this.steps;
    }
    selected(){
        return this.selected;
    }
    setSelected(selected){
        this.selected = selected;
    }
    play(){
        this.playing = true;
    }
    stop(){
        this.playing = false;
    }
    isPlaying(){
        return this.playing;
    }
    updateStep(){
        if(this.playing){
            this.stepPlaying = (this.stepPlaying + 1) % 16;
        }
    }
    setStepPlaying(step){
        this.stepPlaying = step;
    }
}

class Channel{
    
}

class Synth{
    static createAmpEnv(a, d, s, r) { 
        var ampEnv = new Tone.AmplitudeEnvelope();
        ampEnv.set({
        attack: a,
        decay: d,
        sustain: s,
        release: r,
        })               
        return ampEnv;     
    }
    
    static createOscillator(osc_param) {
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
    
    static createFilter(filter_param, adsr_filter){
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
    
    static createFilterEnv(a, d, s, r) {
        return FilterEnv = new Tone.Envelope({
        attack: a,
        decay: d,
        sustain: s,
        release: r,
        });
    
    }
    
    static createLFO(LFO) {
        return LFO = new Tone.Oscillator({
            frequency: LFO.rate,
            waveform: LFO.waveform,
        });
    }
}