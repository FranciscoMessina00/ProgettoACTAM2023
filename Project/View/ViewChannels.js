function changeChannelLeft(){
    var channel = seq.getChannel();
    channel--;
    seq.setChannel(channel);
    var channelName = document.getElementById("channelName");
    channelName.innerHTML = "Channel " + (seq.getChannel() + 1);
    updateColorChannel(seq.getChannel());
    knobs.forEach(kn => updateKnobView(kn));
}
function changeChannelRight(){
    var channel = seq.getChannel();
    channel++;
    seq.setChannel(channel);
    var channelName = document.getElementById("channelName");
    channelName.innerHTML = "Channel " + (seq.getChannel() + 1);
    updateColorChannel(seq.getChannel());
    knobs.forEach(kn => updateKnobView(kn));
}

function updateColorChannel(channel){
    switch(channel){
        case 0:
            document.getElementById("wholeContainer").style.backgroundColor = "#3C3C48";
            break;
        case 1:
            document.getElementById("wholeContainer").style.backgroundColor = "#56243C";
            break;
        case 2:
            document.getElementById("wholeContainer").style.backgroundColor = "#1D571C";
            break;
        case 3:
            document.getElementById("wholeContainer").style.backgroundColor = "#6D1111";
            break;
    }
}