var canvas, ctx, nodes = [], copy = [], BB, offsetX, offsetY, WIDTH, HEIGHT; // canvas related references

function drawGrid() {
    //grid width and height
    var bw = WIDTH;
    var bh = HEIGHT;
    //padding around grid
    var p = 10;
    //size of canvas
    var cw = bw + (p * 2) + 1;
    var ch = bh + (p * 2) + 1;
    ctx.beginPath();
    ctx.lineWidth = "1";
    ctx.strokeStyle = "grey";
    for (var x = 0; x <= bw; x += dim) {
        ctx.moveTo(0.5 + x + p, p);
        ctx.lineTo(0.5 + x + p, bh + p);
    }
    for (var x = 0; x <= bh; x += dim) {
        ctx.moveTo(p, 0.5 + x + p);
        ctx.lineTo(bw + p, 0.5 + x + p);
    }
    ctx.closePath();
    ctx.stroke();
}
  
// reset the canvas
function reset() {
    for (var i = 0; i < nodes.length; i++){
        var r = nodes[i];
        if(r.id != "selection"){
            r.trasparence = 1.0;
            //copy.push(r);
        }
    }
    nodes.splice(0, nodes.length); // remove all element of nodes
    InsertCopy([]); // insert in copy an empty array
    draw();
    selectionok = selectionMode = false;
}

var scaling = 1;

/*function Scale(){
    scaling += 0.1;
}

function Scale2(){
    scaling -= 0.1;
}

function Scaling(){
    var newWidth = WIDTH * scaling;
    var newHeight = HEIGHT * scaling;
    ctx.save();
    ctx.translate(-((newWidth-WIDTH)/2), -((newHeight-HEIGHT)/2));
    ctx.scale(scaling, scaling);
}*/

// clear the canvas
function clear() {
    ctx.fillStyle = "aliceblue"; //"#FAF7F8"
    drawRect(null, 0);
    ctx.fill();
}

// redraw the scene
function draw() {
    clear();
    if (choice)
        drawGrid();
    // redraw each rect in the rects[] array
    for (var i = 0; i < nodes.length; i++) {
        var r = nodes[i];
        if (r.id == "rectangle")
            drawRect(r, 1);
        else if (r.id == "line" || r.id == "arrow")
            drawLine(r);
        else if (r.id == "rhombus")
            drawRhombus(r);
        else if (r.id == "parallelogram")
            drawParallelogram(r);
        else if (r.id == "ellipse")
            drawEllipse(r);
        else if (r.id == "text")
            drawText(r);
        else if (r.id == "selection")
            moveSelection(r);
    }
    drawTrash();
    if(selectionok)
        drawSelection(0,0);
}

function SetCoordinates(){
    BB = canvas.getBoundingClientRect();
    offsetX = BB.left;
    offsetY = BB.top;
}

function init() {
    // get canvas related references
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    SetCoordinates();
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    WIDTH = canvas.width;
    HEIGHT = canvas.height;
    // drag related variables
    dragok = false;
    // listen for mouse events
    canvas.onmousedown = myDown;
    canvas.onmouseup = myUp;
    canvas.onmousemove = myMove;
    canvas.ondblclick = myDoubleClick;
    InsertCopy([]); // insert into copy an empty array
    // call to draw the scene
    draw();
    Menu();
}

window.onload = init;