document.addEventListener('contextmenu', event => event.preventDefault());

function detectClick(){
  const widthCell = (canvas.width / 16);
  const heightCell = canvas.height;
  canvas.addEventListener("mouseup", (e) => {
    var rect = canvas.getBoundingClientRect();
    var x = e.clientX - rect.left;
    var y = e.clientY - rect.top;
    
    var posX = (x/widthCell) - 0.5;
    var posY = (y/heightCell) - 0.5;

    var j = Math.round(posY);
    // console.log(j);
    var i = Math.round(posX);
    // console.log(i);
    var distance = Math.sqrt((Math.abs(posX) - i)**2 + (Math.abs(posY) - j)**2);
    // console.log(distance);
    switch (e.button) {
      case 0:
        if((Math.abs(posX) - i < 100*scale/widthCell) && (Math.abs(posY) - j < 100*scale/heightCell) && (distance < 100*scale/widthCell || distance < 100*scale/heightCell)){
            console.log(i);
            seq.triggerStep(i)
            // steps[i] = 1 - steps[i];
        }
        break;
      case 1:
        // middle clicked
          seq.setStepPlaying(i);
        break;
      case 2:
        // right clicked
        if((Math.abs(posX) - i < 100*scale/widthCell) && (Math.abs(posY) - j < 100*scale/heightCell)){
            console.log(i);
            seq.setSelected(i);
            // selected = i;
        }
        break;
    }
  });
}

Tone.Transport.scheduleRepeat(function(time){
  //do something with the time
  seq.updateStep();
  player.playSound(time);
}, "16n");

requestAnimationFrame(drawSequencer);
detectClick();