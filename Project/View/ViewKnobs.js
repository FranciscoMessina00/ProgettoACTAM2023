function setInitialKnobValues(){
    knobs.forEach(kn => setSingleKnobValues(kn));
}
function setSingleKnobValues(kn){
    knob = kn.querySelector(".knob");
    label = kn.querySelector("input");
    // to get the id of the parameter connected to the div
    // var parameter = label.parentNode.id;
    // then because we have a string as an output to call the model in Defaults.js
    // we will call it with this line of code
    // var value = dictionary_to_consider[parameter]; (example: var value = filter_param[parameter])
    // important note: the value inside a dictionary and the id of the div in HTML must have the same name
    // second note: we need to find a way of finding the right dictionary to consider, we could use
    // a for loop that checks every dictionary and if the parameter is not in the dictionary it will
    // go to the next one until it finds the right one. This means that we need to put each dictionary into
    // an array and then loop through the array.

    spl = label.parentNode.id.split(".")

    var def_value = 0;

    for (let i = 0; i < defaults.length; i++) {
        if(defaults[i] == spl[0]){
            for (const [key, value] of Object.entries(defaults[i + 1])){
                if(key == spl[1]){
                    def_value = value;
                }
            }
        }
   
    }

    label.value = def_value;

    
    // we get maximum and minimum values of label and normalize the range from -170 to 170
    if (knob != null){
        normalizedValue = normalizeToAngle(label);
        knob.style.rotate = normalizedValue + "deg";
    }
    resizeInput(label);
}

function updateKnobView(kn){
    knob = kn.querySelector(".knob");
    label = kn.querySelector("input");

    stp = seq.getChannelSteps();
    params = stp[seq.getSelected()].getParams();

    spl = label.parentNode.id.split(".")

    var def_value = 0;

    for (let i = 0; i < params.length; i++) {
        if(params[i] == spl[0]){
            for (const [key, value] of Object.entries(params[i + 1])){
                if(key == spl[1]){
                    def_value = value;
                }
            }
        }
   
    }

    label.value = def_value;

    
    // we get maximum and minimum values of label and normalize the range from -170 to 170
    if (knob != null){
        normalizedValue = normalizeToAngle(label);
        knob.style.rotate = normalizedValue + "deg";
    }
    resizeInput(label);

}

function normalizeToAngle(label){
    var max = parseFloat(label.max);
    var min = parseFloat(label.min);
    var value = parseFloat(label.value);
    if (value > max) {
        label.value = max;
    }else if (value < min) {
        label.value = min;
    }
    var normalizedValue = (value - min) * 340 / (max - min) - 170;
    if(normalizedValue < -170){
        normalizedValue = -170;
    }else if(normalizedValue > 170){
        normalizedValue = 170;
    }
    return normalizedValue;
}
function normalizeToValue(value, label){
    // we get from -170 to 170 values and normalize the range to the min of the label and max of the label
    var max = parseFloat(label.max);
    var min = parseFloat(label.min);
    var normalizedValue = (value + 170) * (max - min) / 340 + min;
    return normalizedValue;
}
function focusInput(){
    console.log(label);
    knobToChange = knob;
    labelToChange = label;
    labelToChange.style.width = 5 + "ch";
    labelToChange.dispatchEvent(enterKey);
    labelToChange.focus();
}
function updateKnob(){
    labelToChange.blur();
    resizeInput(labelToChange);
    // we get maximum and minimum values of label and normalize the range from -170 to 170
    normalizedValue = normalizeToAngle(labelToChange);
    knob.style.rotate = normalizedValue + "deg";
}
function onMouseMove(event){
    // console.log(parseInt(label.value));
    if(knob.classList.contains("knob")){
        lastCurrentRadiansAngle = normalizeToAngle(label);
        if(event.shiftKey){
            scaling = 0.1;
        }
        else{
            scaling = 1.2;
        }

        mouseY =  - (event.pageY - prevMouseY) ; //get mouse's y position relative to the previous one
        finalAngleInDegrees = ((mouseY * scaling) + lastCurrentRadiansAngle);
        

        //only allowed to rotate if greater than zero degrees or less than 270 degrees
        if(finalAngleInDegrees >= -170 && finalAngleInDegrees <= 170)
        {
            knob.style.rotate = finalAngleInDegrees + "deg";
        }
        if(finalAngleInDegrees < -170)
        {
            finalAngleInDegrees = -170;
        }
        else if(finalAngleInDegrees > 170)
        {
            finalAngleInDegrees = 170;
        }

        if(label.step.length != 1){
            label.value = normalizeToValue(finalAngleInDegrees, label).toFixed(label.step.length - 2);
        } else{
            label.value = normalizeToValue(finalAngleInDegrees, label).toFixed(0);
        }
        
        resizeInput(label);
        prevMouseY = event.pageY;
    }
}

function onMouseUp(){ 
    // label.value = normalizeToValue(finalAngleInDegrees, label);
    updateParamValue()
    //console.log(label)
    resizeInput(label);
    document.removeEventListener("mousemove", onMouseMove); //stop drag
}
function resizeInput(input) {
    input.style.width = input.value.length + "ch";
}
