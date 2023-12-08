
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

function updateParamValue(){
    stp = seq.getChannelSteps();
    params = stp[seq.getSelected()].getParams();

    spl = label.parentNode.id.split(".");

    //console.log(spl)

    var def_value = label.value;

    //console.log(def_value);

    for (let i = 0; i < params.length; i++) {
        if(params[i] == spl[0]){
            console.log("yao");
            tmp_dict = params[i+1];
            for (var [key, value] of Object.entries(params[i + 1])){
                if(key == spl[1]){
                    value = def_value;
                    tmp_dict[key] = value;
                    //console.log(tmp_dict);
                }
            }
        }
   
    }


}