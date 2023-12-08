
const enterKey = new KeyboardEvent('keydown', {
    key: 'Enter',
    code: 'Enter',
    which: 13,
    keyCode: 13,
});
var lastCurrentRadiansAngle = 0;
var knob;
var knobToChange;
var knobs;
var label;
var labelToChange;
var knobPositionY;
var prevMouseY;
var mouseY;
var knobCenterY;
var oppositeSide;
var getRadiansInDegrees;
var finalAngleInDegrees;

// function updateParamValue(value){
//     seq.steps[n]
// }