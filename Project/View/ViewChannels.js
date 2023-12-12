function changeChannelLeft(){
    var channel = seq.getChannelIndex();
    channel--;
    seq.setChannel(channel);
    var channelName = document.getElementById("channelName");
    channelName.innerHTML = "Channel " + (seq.getChannelIndex() + 1);
    updateColorChannel(seq.getChannelIndex());
    knobs.forEach(kn => updateKnobView(kn));
}
function changeChannelRight(){
    var channel = seq.getChannelIndex();
    channel++;
    seq.setChannel(channel);
    var channelName = document.getElementById("channelName");
    channelName.innerHTML = "Channel " + (seq.getChannelIndex() + 1);
    updateColorChannel(seq.getChannelIndex());
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

function visualizeChannels(){
    const ch1Div = document.getElementById('ch1');  
    ch1Div.style.display = 'none';

    const container = document.getElementById('containerSequencer');
    const channelDivs = document.querySelectorAll('.separationSteps');
  
    channelDivs.forEach(function(div) {
        if (div.id !== 'canvasContainer') {
            div.addEventListener('click', function() {
                // Show all channels except the canvasContainer
                channelDivs.forEach(function(ch) {
                    if (ch.id !== 'canvasContainer') {
                    ch.style.display = 'block';
                    }
                });

                // Detach canvasContainer
                const canvasContainer = document.getElementById('canvasContainer');
                const detachedCanvas = container.removeChild(canvasContainer);
                
                // Hide the clicked channel
                div.style.display = 'none';

                // Reinsert canvasContainer in place of hidden channel
                const clickedIndex = Array.from(channelDivs).indexOf(div);
                container.insertBefore(detachedCanvas, container.children[clickedIndex]);
                console.log(clickedIndex)
                var canvCont = document.getElementById("canvasContainer");
                canvCont.style.borderBottomRightRadius = "0px";
                canvCont.style.borderBottomLeftRadius = "0px";
                switch(clickedIndex){
                    case 0:
                        seq.setChannel(0);
                        canvCont.style.backgroundColor = updateColorChannel(seq.getChannelIndex());
                        break;
                    case 1:
                        break;
                    case 2:
                        seq.setChannel(1);
                        canvCont.style.backgroundColor = updateColorChannel(seq.getChannelIndex());
                        break;
                    case 3:
                        seq.setChannel(2);
                        canvCont.style.backgroundColor = updateColorChannel(seq.getChannelIndex());
                        break;
                    case 4:
                        seq.setChannel(3);
                        canvCont.style.backgroundColor = updateColorChannel(seq.getChannelIndex());
                        canvCont.style.borderBottomRightRadius = "10px";
                        canvCont.style.borderBottomLeftRadius = "10px";
                        break;
                }
                changeBorders();
                knobs.forEach(kn => updateKnobView(kn));
            });
        }
    });
};

function changeBorders(){
    var allSteps = seq.getAllSteps();
    for(var i = 0; i < 4; i++){
        var childrenList = document.getElementById("ch" + (i+1)).children;
        for(var j = 0; j < 16; j++){
            if(j == seq.getStepPlaying() && seq.isPlaying()){
                childrenList[0].children[j].style.backgroundColor = "#6C3D11";
            }else{
                if(allSteps[i].getChannel()[j].getToPlay() == 1){
                    childrenList[0].children[j].style.backgroundColor = "#C80000";
                }else{
                    childrenList[0].children[j].style.backgroundColor = "#D9D9D9";
                }
            }
        }
    }
}