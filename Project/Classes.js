class Sequencer{
    constructor(){
        this.channel = 0;
        this.steps = [
                        new Channel(),
                        new Channel(),
                        new Channel(),
                        new Channel()
                    ];
        this.selected = 0;
        this.playing = false;
        this.stepPlaying = 15;
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
        var curr_channel = this.steps[this.channel].getChannel()
        curr_channel[step].setToPlay(1-curr_channel[step].getToPlay());  
    }
    getChannelSteps(){
        return this.steps[this.channel].getChannel();
    }
    getAllSteps(){
        return this.steps;
    }
    getSelected(){
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
    getStepPlaying(){
        return this.stepPlaying;
    }
}

class Channel{
    constructor(){
        this.instrument = new Tone.Synth().toDestination();
        this.steps = [];
        for (let i = 0; i <= 15; i++) {
            this.steps[i] = new Step();           
        }
    }
    getChannel(){
        return this.steps;
    }
    playChannel(note, time){
        this.steps[seq.getStepPlaying()].playSound(note, time, this.instrument);      
    }
}

class Step{
    constructor(){
        this.toPlay = 0;
        this.osc_param = {...osc_param};
        this.filter_param = {...filter_param};
        this.LFO = {...LFO};
        this.adsr_mix = {...adsr_mix};
        this.adsr_filter = {...adsr_filter};
        this.flanger_param = {...flanger_param};
        this.params = ["osc_param", this.osc_param, "filter_param", this.filter_param, "LFO", this.LFO, "adsr_mix", 
                        this.adsr_mix, "adsr_filter", this.adsr_filter, "flanger_param", this.flanger_param];
    }
    playSound(note, time, instrument){
        if(this.toPlay == 1){
            console.log(seq.getStepPlaying());
            instrument.triggerAttackRelease(note, "16n", time);
        }
    }
    //getters
    getToPlay(){
        return this.toPlay;
    }
    getOscParam(){
        return this.osc_param;
    }
    getFilterParam(){
        return this.filter_param;
    }
    getLFO(){
        return this.LFO;
    }
    getAdsrMix(){
        return this.adsr_mix;
    }
    getAdsrFilter(){
        return this.adsr_filter;
    }
    getFlangerParam(){
        return this.flanger_param;
    }
    getParams(){
        return this.params; 
    }
    
    //setters
    setToPlay(value){
        // console.log("hello!")
        this.toPlay = value;
    }
    setOscParam(value){
        this.osc_param = value;
    }
    setFilterParam(value){
        this.filter_param = value;
    }
    setLFO(value){
        this.LFO = value;
    }
    setAdsrMix(value){
        this.adsr_mix = value;
    }
    setAdsrFilter(value){
        this.adsr_filter = value;
    }
    setFlangerParam(value){
        this.flanger_param = value;
    }
    setParams(value){
        this.params = value;
    }
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
        var env = Synth.createFilterEnv(adsr_filter.attack,adsr_filter.decay,adsr_filter.sustain,adsr_filter.release);
        var envAmount = new Tone.Gain(filter_param.env_amount);
        var LFOAmt = new Tone.Gain(filter_param.LFO_amount);
        
        return {
            filter: filter,
            env: env, 
            envAmount: envAmount, 
            LFOAmt: LFOAmt};
    }
    
    static createFilterEnv(a, d, s, r) {
        var FilterEnv = new Tone.Envelope({
        attack: a,
        decay: d,
        sustain: s,
        release: r,
        });
        return FilterEnv;
    }
    
    static createLFO(LFO) {
        var LFO = new Tone.Oscillator({
            frequency: LFO.rate,
            waveform: LFO.waveform,
        });
        return LFO;
    }
}

class Player{
    constructor(){
        
    }
    start(sequencer){
        sequencer.play();
        Tone.Transport.start();
    }
    stop(sequencer){
        Tone.Transport.stop();
        sequencer.stop();
        sequencer.setStepPlaying(15);
    }
    playSound(time){
        var notes = ["C4", "E4", "G4", "B4"];
        var channels = seq.getAllSteps();
        for (var i = 0; i < 4; i++) {
            channels[i].playChannel(notes[i], time);
        }
    }
}