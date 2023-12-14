// we don't allow the context menu to appear when right clicking
document.addEventListener('contextmenu', event => event.preventDefault());

// The function detects when the user clicks on the canvas
function detectClick(){
  // we get the dimension of a cell of the step to draw
  const widthCell = (canvas.width / 16);
  const heightCell = canvas.height;
  // we add an event listener for when the user clicks on the canvas
  canvas.addEventListener("mousedown", (e) => {
    // we map the position of the mouse from the point of reference page to the one of the canvas
    var rect = canvas.getBoundingClientRect();
    var x = e.clientX - rect.left;
    var y = e.clientY - rect.top;
    
    // we map the position of the mouse from the point of reference canvas to the one of the sequencer
    // to be more precise, we translate the position relative to the center of the step, not the border
    var posX = (x/widthCell) - 0.5;
    var posY = (y/heightCell) - 0.5;

    // we round the position to the nearest integer, so that we get the clicked step
    // the variable i is the important one
    var j = Math.round(posY);
    var i = Math.round(posX);
    // we calculate the distance of the click from the center of the step
    var distance = Math.sqrt((Math.abs(posX) - i)**2 + (Math.abs(posY) - j)**2);
    switch (e.button) {
      case 0:
        // left clicked
        // we check if the click was inside the step, we check the radius distance from the center,
        // but also horizontal and vertical distance (100 is the original radius of the step, but it is scaled because
        // the original dodecagon was bigger)
        if((Math.abs(posX) - i < 100*scale/widthCell) && (Math.abs(posY) - j < 100*scale/heightCell) && (distance < 100*scale/widthCell || distance < 100*scale/heightCell)){
          // we trigger the specific step
          seq.triggerStep(i);
        }
        break;
      case 1:
        // middle clicked
        // we set the step we want the sequencer to start playing from
        seq.setStepPlaying(i);
        break;
      case 2:
        // right clicked
        // we check if the click was inside the step, we check the radius distance from the center,
        // but also horizontal and vertical distance (100 is the original radius of the step, but it is scaled because
        // the original dodecagon was bigger)
        if((Math.abs(posX) - i < 100*scale/widthCell) && (Math.abs(posY) - j < 100*scale/heightCell) && (distance < 100*scale/widthCell || distance < 100*scale/heightCell)){  
          // we select the step as a playable step
          seq.setSelected(i);
          knobs.forEach(kn => updateKnobView(kn));
        }
        break;
    }
  });
}

Tone.Transport.scheduleRepeat(function(time){
  // we schedule the metronome of the sequencer with beats every 16th of a note
  // we update the step
  seq.updateStep();
  // we play the step at that specific time
  player.playSound(time);
}, "16n");

// draw the sequencer
requestAnimationFrame(drawSequencer);
detectClick();
// we draw the channels
visualizeChannels();
// we draw the little steps in the HTML file
for (var i = 0; i < 4; i++) {
  var ch = document.getElementById('ch' + (i + 1)).firstChild;
  drawLittleSteps(ch, i);
}