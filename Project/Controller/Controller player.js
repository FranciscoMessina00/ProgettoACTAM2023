Tone.Transport.scheduleRepeat(function(time){
    //do something with the time
    playSound(time);
    position = (position + 1) % cols;
}, "8n");

function start(){
    seq.play();
    Tone.Transport.start();
}
function stop(){
    seq.stop();
    Tone.Transport.stop();
    seq.setStepPlaying(0);
}

function playSound(time){
    var note;
    for (var i = 0; i < rows; i++) {
        note = notes[i];
        for(var j = 0; j < cols; j++){
            if(matrix[i][j] == 1 && j == position){
                synth.triggerAttackRelease(note, "16n", time);
            }
        }
    }
}