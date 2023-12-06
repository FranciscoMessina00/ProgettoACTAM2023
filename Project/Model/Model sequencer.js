var seq = new Sequencer();
var canvas = document.getElementById("step");
var ctx = canvas.getContext("2d");
var scale = 0.3;
canvas.width  = 1200;
canvas.height = 86;

var colorDodOffOut = '#D9D9D9';
var colorDodOffIn = '#B1B1B1';

var colorDodOnOut = '#8951FF';
var colorDodOnIn = '#BE6AFF';

var colorPlayingOut = '#F5A94F'
var colorPlayingIn = '#C89140';

var colorRectOffNotSel = '#7B7B7B';
var colorRectOffSel = '#FF9CD2';
var colorRectOn = '#C80000';

var strokeNotPlaying = '#44116C';
var strokePlaying = '#6C3D11';