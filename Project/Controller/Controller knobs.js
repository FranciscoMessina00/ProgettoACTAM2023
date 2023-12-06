function detectKnob(){
    knobs = document.querySelectorAll(".container");
    
    knobs.forEach(c=> c.addEventListener("mousedown", (e) => {
        prevMouseY = e.pageY;
        knob = c.querySelector(".knob");
        if(knob == null){
            knob = c.querySelector(".waveType");
        }
        label = c.querySelector("input");
        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", onMouseUp);
        label.addEventListener("change", updateKnob);
    }));

}

detectKnob();
setInitialKnobValues();