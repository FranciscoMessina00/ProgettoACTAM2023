var globals = {
    bpm: 120,
}

osc_param = {
    freq : 440,  
    type : 'sine', 
    modType: 'sine',
    harm : 1.3, 
    mod : 1,
    LFOamt: 50,
}

var LFO = {
    waveform : 'sine',
    rate : 2, //0.1-20000 Hz
    sync : false,
}

var adsr_mix = {
    is_ar : false,
    attack : 200,
    decay : 200,
    sustain: 0.5,
    release : 200,
    tmp_decay : 0,
    tmp_sustain : 0
}

var kick_param = {
    pitch: 50,
    a: 0.001,
    d: 0.01,
    s: 1,          
    r: 1,
    fa: 0.001,
    fd: 0.01,
    fs: 1,
    fr: 0.3,        // Release dell'inviluppo sul pitch
    sweep: 100,     // Quantità d'inviluppo sul pitch
    volume: 1,
    position: 0
}

var snare_param = {
    pitch: 180,
    color: "brown",    // colore del noise (white, pink, brown)
    balance: 0.7,  //    // 0-1, bilancia il suono tra i cosiddetti parametri body e snap //
    volume: 1,
    a: 0.001,
    d: 0.01,
    s: 1,
    r: 0.3,
    fa: 0.001,
    fd: 0.01,
    fs: 1,
    fr: 0.05,         // Release del freq env
    sweep: 100,       // Amount di env sul pitch
    position: 0
}

var hat_param = {
    volume: 1,
    a: 0.001,
    d: 0.01,
    s: 1,
    r: 0.1,
    cutoff: 3000,   // Filtro del noise per cambiare colore ai piatti
    position: 0,
    closed: 1       // 0 o 1  Così gestisci l'alternarsi di open e closed hihat (vedi createHat) 
}

var tom_param = {
    hiPitch: 150,
    a: 0.01,
    d: 0.01,
    s: 1,
    r: 0.4,
    color: 0.5,    // 0-1 Introduce ciccia attraverso una distorsione (diversa da quella del flanger, vedi createTom)
    position: 0,
    volume: 1
}

var flanger_param = {     // Questi parametri sono gli stessi di synth.js
    rate : 0.3,           // 0.1-20000 Hz
    type : 'sine',
    depth: 0.3,           // 0.1-1    Attenua l'uscita delle delay line
    feedback : 0.9,       // 0-1      Regola il feedback (1 è abbastanza sgravato). Notare l'implementazione di un percorso di crossfeedback (il feedback di destra va al canale sinistro e viceversa, vedi createFlanger)
    width : 0.010,        // 0-0.015  Osserva i valori delle delay line!
    dw: 0,              // 0-1      Semplice DryWet
    color: 0,             // 0-1      Quantità di distorsione. Questo comportamento è fortemente influenzato dal valore di feedback (vedi createFlanger per vedere come i due parametri sono relazionati)
    stereo: 1             // 0-1      Crea delle differenze tra il canale di destra e sinistra (vedi createFlanger)   
}


defaults = ["globals", globals, "osc_param", osc_param, "LFO", LFO, "adsr_mix", adsr_mix, "flanger_param", flanger_param];