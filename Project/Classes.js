class Sequencer{
    constructor(){
        this.channel = 0;
        this.globals = {...globals};
        this.steps = [
                        new Channel(),
                        new Channel(),
                        // new Channel(),
                        // new Channel()
                    ];
        this.selected = 0;
        this.playing = false;
        this.stepPlaying = -1;
        this.nChannels = this.steps.length;
    }
    
    // getters

    getGlobals(){
        return this.globals.bpm;
    }
    getChannelIndex(){
        return this.channel;
    }
    getChannel(){
        return this.steps[this.channel];
    }
    getChannelSteps(){
        return this.steps[this.channel].getSteps();
    }
    getAllSteps(){
        return this.steps;
    }
    getSelected(){
        return this.selected;
    }
    getStepPlaying(){
        return this.stepPlaying;
    }
    getNChannels(){
        return this.nChannels;
    }
    getCurrentStep(){
        return this.steps[this.channel].getSteps()[this.stepPlaying];
    }
    //setters
    setGlobals(value){
        this.globals.bpm = value;
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
    setSelected(selected){
        this.selected = selected;
    }
    setStepPlaying(step){
        this.stepPlaying = step;
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
    triggerStep(step){
        var curr_channel = this.steps[this.channel].getSteps()
        curr_channel[step].setToPlay(1-curr_channel[step].getToPlay());  
    }
    
}

class Channel{
    constructor(){
        this.steps = [];
        for (let i = 0; i <= 15; i++) {
            this.steps[i] = new Step();           
        }
        this.limiter = new Tone.Limiter(-1);
        this.limiter.connect(Tone.Destination);
        // Parameters for the synth
        // this.filter = Synth.createFilter(filter_param, adsr_filter);
        this.ampEnv = Synth.createAmpEnv(adsr_mix.attack,adsr_mix.decay,adsr_mix.sustain,adsr_mix.release);
        this.oscillator = Synth.createOscillator(osc_param);
        this.LFO = Synth.createLFO(LFO);
        // Connections
        this.oscillator.fmOsc.chain(this.ampEnv, this.limiter);
        // this.filter.env.chain(this.filter.envAmount, this.filter.filter.frequency);
        // this.LFO.chain(this.filter.LFOAmt, this.filter.filter.frequency);
        this.LFO.chain(this.oscillator.LFOModFm, this.oscillator.fmOsc.modulationIndex);
        this.LFO.start()
        // this.instrument = new Tone.Synth().toDestination();
        this.oscillator.fmOsc.start();
    }

    getOscillator(){
        return this.oscillator;
    }
    getAmpEnv(){
        return this.ampEnv;
    }
    // getFilter(){
    //     return this.filter;
    // }
    // getFilterEnv(){
    //     return this.filter.env;
    // }
    getLFO(){
        return this.LFO;
    }
    
    getSteps(){
        return this.steps;
    }
    // playChannel(note, time){
    //     this.steps[seq.getStepPlaying()].playSound(note, time, this.ampEnv);     
    // }
    playChannel(time=0, singlePlay=false){
        if(seq.getStepPlaying() != -1 || singlePlay){
            var stepToPlay = seq.getStepPlaying();
            if(singlePlay){
                stepToPlay = seq.getSelected();
            }
            this.steps[stepToPlay].playSound(time, this.ampEnv, singlePlay);
        }
    }
}

class Step{
    constructor(){
        this.toPlay = 0;
        this.osc_param = {...osc_param};
        // this.filter_param = {...filter_param};
        this.LFO = {...LFO};
        this.adsr_mix = {...adsr_mix};
        // this.adsr_filter = {...adsr_filter};
        this.flanger_param = {...flanger_param};
        this.params = ["osc_param", this.osc_param, "LFO", this.LFO, "adsr_mix", this.adsr_mix, "flanger_param", this.flanger_param];
        
    }

    playSound(time=0, ampEnv, singlePlay=false){
        if(this.toPlay == 1 || singlePlay){
            if(!singlePlay){
                // to stop the previous envelope we trigger the release
                ampEnv.triggerRelease(time)
                Tone.Transport.schedule(updateSynthParams(), time + 0.05);
                ampEnv.triggerAttackRelease(ampEnv.attack, time + 0.1);
            }else{
                console.log("singlePlay")
                // I had to add the start and stop of the transport because otherwise the synth would not play
                // whenn I started the page. I don't know why this happens, but it works.
                Tone.Transport.start();
                ampEnv.triggerAttackRelease(ampEnv.attack);
                Tone.Transport.stop();
            }
            
            // filter.triggerAttackRelease(filter.attack, time + 0.05);
        }
    }
    //getters
    getToPlay(){
        return this.toPlay;
    }
    getOscParam(){
        return this.osc_param;
    }
    // getFilterParam(){
    //     return this.filter_param;
    // }
    getLFO(){
        return this.LFO;
    }
    getAdsrMix(){
        return this.adsr_mix;
    }
    // getAdsrFilter(){
    //     return this.adsr_filter;
    // }
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
    // setFilterParam(value){
    //     this.filter_param = value;
    // }
    setLFO(value){
        this.LFO = value;
    }
    setAdsrMix(value){
        this.adsr_mix = value;
    }
    // setAdsrFilter(value){
    //     this.adsr_filter = value;
    // }
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
            attack: a/1000,
            decay: d/1000,
            sustain: s,
            release: r/1000,
        })               
        return ampEnv;     
    }
    
    static createOscillator(osc_param) {
        var fmOsc = new Tone.FMOscillator();
        var LFOModFm = new Tone.Gain(osc_param.LFOamt, "gain");
        fmOsc.set({
            frequency: osc_param.freq,
            type: osc_param.type,
            modulationType: osc_param.modType,
            harmonicity: osc_param.harm,
            modulationIndex: osc_param.mod,
            LFOamt: osc_param.LFOamt
        })
        return {
            fmOsc: fmOsc,
            LFOModFm: LFOModFm};
    }
    
    static createKick(kick_param) {
        var o = new Tone.Oscillator(kick_param.pitch, "triangle");   //Vogliamo lasciare la possibilità di cambiare forma d'onda? Potrebbe essere un'idea  
        var amp = new Tone.AmplitudeEnvelope();
        amp.set({
            attack: kick_param.a,
            decay: kick_param.d,
            sustain: kick_param.s,
            release: kick_param.r,
        })
        var freqEnv = new Tone.Envelope();
        freqEnv.set({
            attack: kick_param.fa,
            decay: kick_param.fd,
            sustain: kick_param.fs,
            release: kick_param.fr,
        })
        var volume = new Tone.Gain(kick_param.volume, "gain");
        var pan = new Tone.Panner(kick_param.position);
        var freqEnvAmt = new Tone.Gain(kick_param.sweep, "gain");
        o.chain(amp, volume, pan);
        freqEnv.chain(freqEnvAmt, o.frequency);
        o.start();

        return {
            o: o,
            volume: volume,
            pan: pan,
            amp: amp,
            freqEnv: freqEnv,
        };
    }
    
    static createLFO(LFO) {
        var LFO = new Tone.Oscillator({
            frequency: LFO.rate,
            waveform: LFO.waveform,
        });
        return LFO;
    }

    static createSnare(snare_param) {
        var tonal = new Tone.Oscillator(snare_param.pitch, "sine");  // Body
        var noise = new Tone.Noise(snare_param.color);               // Snap
        var balance = new Tone.CrossFade(snare_param.balance);
        var volume = new Tone.Gain(snare_param.volume, "gain");
        var amp = new Tone.AmplitudeEnvelope();
        amp.set({
            attack: snare_param.a,
            decay: snare_param.d,
            sustain: snare_param.s,
            release: snare_param.r,
        })
        var freqEnv = new Tone.Envelope();
        freqEnv.set({
            attack: snare_param.fa,
            decay: snare_param.fd,
            sustain: snare_param.fs,
            release: snare_param.fr,
        })
        var freqEnvAmt = new Tone.Gain(snare_param.sweep, "gain");
        var pan = new Tone.Panner(snare_param.position);
        tonal.connect(balance.a);
        noise.connect(balance.b);
        balance.chain(amp, volume, pan);
        freqEnv.chain(freqEnvAmt, tonal.frequency);
        tonal.start();
        noise.start();
        return {
        pan: pan,
        amp: amp,
        freqEnv: freqEnv,
        tonal: tonal,
        noise: noise,
        balance: balance,
        volume: volume,
        freqEnvAmt: freqEnvAmt,
        }
    }

    static createHat(){
        var noise = new Tone.Noise("white");
        var filter = new Tone.Filter(hat_param.cutoff, "highpass");   // Si sceglie il carattere degli hat
        var amp = new Tone.AmplitudeEnvelope();
        if (hat_param.open == 0){   // Attraverso l'if si gestisce l'alternanza di open e closed
            amp.set({
                attack: hat_param.a,
                decay: hat_param.d,
                sustain: hat_param.s,
                release: hat_param.r,
            })
        }
        else {
            amp.set({
                attack: hat_param.a,
                decay: hat_param.d,
                sustain: hat_param.s,
                release: hat_param.r + 0.2,   // L'open ha un release più lungo
            })
        }
        var volume = new Tone.Gain(hat_param.volume, "gain");
        var pan = new Tone.Panner(hat_param.position);
        noise.chain(filter, amp, volume, pan);
        noise.start();
        return{
            noise: noise,
            filter: filter,
            amp: amp,
            volume: volume,
            pan: pan,
        }
    }

    static createTom(tom_param) {
        var sine = new Tone.Oscillator(tom_param.hiPitch, "sine");
        
        var dist = new Tone.WaveShaper(function (val) {
        var amt = 7;
        return Math.tanh(amt*val);   // Mi piace molto come suona questo soft clipping
        }, 2048);

        var amp = new Tone.AmplitudeEnvelope();
        amp.set({
            attack: tom_param.a,
            decay: tom_param.d,
            sustain: tom_param.s,
            release: tom_param.r,
        })
        var volume = new Tone.Gain(tom_param.volume, "gain");
        var pan = new Tone.Panner(tom_param.position);
        var color = new Tone.CrossFade(tom_param.color);
        sine.chain(amp, dist, color.b);
        amp.connect(color.a);
        color.chain(volume, pan);
        sine.start();
        return{
            sine: sine,
            color: color,
            dist: dist,
            amp: amp,
            volume: volume,
            pan: pan,
        }
    }

    static createFlanger(flanger_param) {

        var LFOl = new Tone.Oscillator(flanger_param.rate, flanger_param.type);
        var LFOr = new Tone.Oscillator(flanger_param.rate + flanger_param.stereo, flanger_param.type);  // Il parametro stereo alza la frequenza di uno dei due LFO
        var modl = new Tone.Gain(flanger_param.width, "gain");
        var modr = new Tone.Gain(flanger_param.width - flanger_param.stereo*0.005, "gain");  // Il parametro stereo abbassa la quantità di modulazione dell'LFO
        var dlyl = new Tone.Delay(0.015, 0.030);
        var dlyr = new Tone.Delay(0.015 - flanger_param.stereo*0.005, 0.035);  // Il parametro stereo abbassa il ritardo iniziale di una delle due linee di ritardo
        var feedbackl = new Tone.Gain(flanger_param.feedback, "gain");
        var feedbackr = new Tone.Gain(flanger_param.feedback, "gain");
        var range_depthl = new Tone.Gain(flanger_param.depth, "gain");
        var range_depthr = new Tone.Gain(flanger_param.depth, "gain");
        var crossFadel = new Tone.CrossFade(0.5);
        var crossFader = new Tone.CrossFade(0.5);
        var dryWet = new Tone.CrossFade(flanger_param.dw);
        var colorl = new Tone.CrossFade(flanger_param.color);  // I due color verranno utilizzati per creare una specie di drywet interno al flanger per gestire la quantità di distorsione
        var colorr = new Tone.CrossFade(flanger_param.color);
        var overdrivel = new Tone.WaveShaper(function (val) {

            var amt = 3 - flanger_param.feedback;  // Bisogna abbassare l'amt di distorsione perché con valori di feedback troppo alti si rischia l'auto-oscillazione del flanger. Il carattere della distorsione dipende tantissimo dal feedback e non solo per l'operazione di sottrazione ma soprattutto per come questo cambia il flusso del segnale audio
            return Math.tanh(2^(amt*val));  //tanh e 2^val sono funzioni utilizzate nel design di distorsori. Io le ho combinate, se volete sperimentate altre funzioni.
            }, 2048);

        var overdriver = new Tone.WaveShaper(function (val) {

            var amt = 3 - flanger_param.feedback;
            return Math.tanh(2^(amt*val));  //tanh e 2^val sono funzioni utilizzate nel design di distorsori. Io le ho combinate, se volete sperimentate altre funzioni.
            }, 2048);    

        var s = new Tone.Split();
        var m = new Tone.Merge();
        s.connect(crossFadel.a, 0, 0);
        crossFadel.connect(dlyl, 0, 0);
        dlyl.connect(overdrivel, 0, 0);
        dlyl.connect(colorl.a, 0, 0);
        overdrivel.connect(colorl.b, 0, 0);
        colorl.connect(feedbackl, 0, 0);
        feedbackl.connect(crossFader.b, 0, 0);  // Qui (e nel punto simmetrico nel canale r) avviene la connessione incrociata dei percorsi di feedback
        dlyl.connect(range_depthl, 0, 0)
        LFOl.chain(modl, dlyl.delayTime);
        s.connect(crossFader.a, 1, 0);
        crossFader.connect(dlyr, 0, 0);
        dlyr.connect(overdriver, 0, 0);
        dlyr.connect(colorr.a, 0, 0);
        overdriver.connect(colorr.b, 0, 0);
        colorr.connect(feedbackr, 0, 0);
        feedbackr.connect(crossFadel.b, 0, 0);
        dlyr.connect(range_depthr, 0, 0)
        LFOr.chain(modr, dlyr.delayTime);
        range_depthl.connect(m, 0, 0);
        range_depthr.connect(m, 0, 1);
        m.connect(dryWet.b);
        LFOl.start();
        LFOr.start();
        return {
            s: s, //Ho voluto fare le connessioni interne del flanger dentro la funzione, ho messo a disposizione solo il nodo in e out
            dryWet: dryWet,}
    }

    static foldaLaMamma(amt, val) {
        var condition = val*amt;
        var out1 = 1 - (val * amt - 1);
        var out2 = -1 - (val * amt - 1);
        
        if (condition > 1) {
            if (out1 > -1 && out1 < 1) {
                return out1;
            }else {return foldaLaMamma(1, out1);}
        } else if (condition < -1) {
            if (out2 < 1 && out2 > -1) {
                return out2;
            } else {return foldaLaMamma(1, out2);}
                
        } else {
            return val * amt;
        }
    }

    static brutalize(block, fold_amt, dist_amt, drywet) {
        var folder = new Tone.WaveShaper(function (val) {
            return foldaLaMamma(fold_amt, val);
        }, 2048);

        var dist = new Tone.WaveShaper(function (val) {
            
            var amt = dist_amt;
        
            return Math.tanh(val*amt);    
            }, 2048);

        var drywet = new Tone.CrossFade(drywet);
        
        block.connect(folder);
        folder.chain(dist, drywet.b);
        folder.connect(drywet.a);
        
        return drywet
    }

    
}

class Player{
    constructor(){
        
    }
    start(sequencer){
        sequencer.play();
        // Tone.start();
        Tone.Transport.start();
    }
    stop(sequencer){
        Tone.Transport.stop();
        sequencer.stop();
        sequencer.setStepPlaying(-1);
        changeBorders();
        drawSequencer();
    }
    playSound(time){
        // var notes = ["C4", "E4", "G4", "B4"];
        var channels = seq.getAllSteps();
        for (var i = 0; i < seq.getNChannels(); i++) {
            // channels[i].playChannel(notes[i], time);
            channels[i].playChannel(time);
        }
        changeBorders();
    }
}