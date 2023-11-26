function drawDodecagon(step){
    var cornerRadius = 30;
    ctx.lineWidth = 4;
    const grd = ctx.createRadialGradient(0, 0, 0, 0, 0, 100);
    if(step == 0){
        grd.addColorStop(1, '#D9D9D9');
        grd.addColorStop(0, '#B1B1B1');
        ctx.strokeStyle = "#44116C";
    }else{
        grd.addColorStop(1, '#8951FF');
        grd.addColorStop(0, '#BE6AFF');
        ctx.strokeStyle = "#44116C";
    }
    ctx.fillStyle = grd;
    ctx.beginPath(); // start a new path
    roundedPoly(dodecagon, cornerRadius);
    ctx.fill();
    ctx.stroke();
}

function drawRect(step){
    ctx.beginPath();
    var sideRect = 80;
    var heightRect = 16;
    var yPos = -60;
    var rad = 5;
    ctx.globalAlpha = 0.75;
    ctx.strokeStyle = "transparent";
    ctx.lineWidth = 0;
    if(step == 0){
        ctx.fillStyle = "#7B7B7B";
    }else{
        ctx.fillStyle = "#FF9CD2";
    }
    ctx.roundRect(-sideRect/2, yPos, sideRect, heightRect, rad);
    ctx.fill();
    ctx.stroke();
    ctx.globalAlpha = 1;
}

function drawStep(posX, posY, scale = 1, step = 0){
    ctx.translate(posX, posY);
    ctx.scale(scale, scale);
    drawDodecagon(step);
    drawRect(step);
    ctx.scale(1/scale, 1/scale);
    ctx.translate(-posX, -posY);
}

var roundedPoly = function(points,radius){
    var i, x, y, len, p1, p2, p3, v1, v2, sinA, sinA90, radDirection, drawDirection, angle, halfAngle, cRadius, lenOut;
    var asVec = function (p, pp, v) { // convert points to a line with len and normalised
        v.x = pp.x - p.x; // x,y as vec
        v.y = pp.y - p.y;
        v.len = Math.sqrt(v.x * v.x + v.y * v.y); // length of vec
        v.nx = v.x / v.len; // normalised
        v.ny = v.y / v.len;
        v.ang = Math.atan2(v.ny, v.nx); // direction of vec
    }
    v1 = {};
    v2 = {};
    len = points.length;                         // number points
    p1 = points[len - 1];                        // start at end of path
    for (i = 0; i < len; i++) {                  // do each corner
        p2 = points[(i) % len];                  // the corner point that is being rounded
        p3 = points[(i + 1) % len];
        // get the corner as vectors out away from corner
        asVec(p2, p1, v1);                       // vec back from corner point
        asVec(p2, p3, v2);                       // vec forward from corner point
        // get corners cross product (asin of angle)
        sinA = v1.nx * v2.ny - v1.ny * v2.nx;    // cross product
        // get cross product of first line and perpendicular second line
        sinA90 = v1.nx * v2.nx - v1.ny * -v2.ny; // cross product to normal of line 2
        angle = Math.asin(sinA);                 // get the angle
        radDirection = 1;                        // may need to reverse the radius
        drawDirection = false;                   // may need to draw the arc anticlockwise
        // find the correct quadrant for circle center
        if (sinA90 < 0) {
            if (angle < 0) {
                angle = Math.PI + angle; // add 180 to move us to the 3 quadrant
            } else {
                angle = Math.PI - angle; // move back into the 2nd quadrant
                radDirection = -1;
                drawDirection = true;
            }
        } else {
            if (angle > 0) {
                radDirection = -1;
                drawDirection = true;
            }
        }
        halfAngle = angle / 2;
        // get distance from corner to point where round corner touches line
        lenOut = Math.abs(Math.cos(halfAngle) * radius / Math.sin(halfAngle));
        if (lenOut > Math.min(v1.len / 2, v2.len / 2)) { // fix if longer than half line length
            lenOut = Math.min(v1.len / 2, v2.len / 2);
            // ajust the radius of corner rounding to fit
            cRadius = Math.abs(lenOut * Math.sin(halfAngle) / Math.cos(halfAngle));
        } else {
            cRadius = radius;
        }
        x = p2.x + v2.nx * lenOut; // move out from corner along second line to point where rounded circle touches
        y = p2.y + v2.ny * lenOut;
        x += -v2.ny * cRadius * radDirection; // move away from line to circle center
        y += v2.nx * cRadius * radDirection;
        // x,y is the rounded corner circle center
        ctx.arc(x, y, cRadius, v1.ang + Math.PI / 2 * radDirection, v2.ang - Math.PI / 2 * radDirection, drawDirection); // draw the arc clockwise
        p1 = p2;
        p2 = p3;
    }
    ctx.closePath();
}

function drawSequencer(){
    var scale = 0.3;
    for (var i = 0; i < 16; i++) {
        drawStep(100 * scale + i * 220 * scale + 10 * scale, 100 * scale + 10 * scale, scale, steps[i]);
    }
    requestAnimationFrame(drawSequencer);
}
function detectClick(){
    const cell = 220 * 0.3;
    document.addEventListener('contextmenu', event => event.preventDefault());
    canvas.addEventListener('contextmenu', function(e) {
        var rect = canvas.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        
        var posX = (x/cell);
        var posY = (y/cell);

        var j = Math.floor(posY);
        var i = Math.floor(posX);
        
        var distance = Math.sqrt((posX - (i + 0.5))**2 + (posY - (j + 0.5))**2);
        /* console.log(i, j);
        console.log(posX, posY);
        console.log(distance); */
        if((distance < 0.45)){
            steps[i] = 1 - steps[i];
        }
    });
}

var channels = [1, 0, 0, 0]
var steps = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var canvas = document.getElementById("step");
var ctx = canvas.getContext("2d");
canvas.width  = window.innerWidth;
canvas.height = window.innerHeight;

var dodecagon = [
    {x: 0   , y: -100},
    {x: -50 , y: -87 },
    {x: -87 , y: -50 },
    {x: -100, y: 0   },
    {x: -87 , y: 50  },
    {x: -50 , y: 87  },
    {x: 0   , y: 100 },
    {x: 50  , y: 87  },
    {x: 87  , y: 50  },
    {x: 100 , y: 0   },
    {x: 87  , y: -50 },
    {x: 50  , y: -87 },
]

var scale = 0.3;
var lengthSequencer = 100 * scale + 15 * 220 * scale + 100 * scale + 20 * scale;
canvas.width  = lengthSequencer;
canvas.height = 200 * scale + 10 * scale;
requestAnimationFrame(drawSequencer);
detectClick();




//ctx.scale(0.2, 0.2);

// drawStep(100, 100);
/* var sides = 12;
var angle = (sides - 2) * 180 / sides;
var lengthSide = 50

// I draw a dodecahedron
ctx.beginPath();
ctx.moveTo(lengthSide, 0);
for (var i = 0; i < sides; i++) {
    ctx.rotate(Math.PI / 180 * (180 - angle));
    ctx.lineTo(lengthSide, 0);
}

ctx.stroke();
*/
