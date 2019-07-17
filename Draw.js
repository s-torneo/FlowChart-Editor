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

// clear the canvas
function clear() {
    ctx.fillStyle = "white";
    drawRect(null, 0);
    ctx.fill();
}

// redraw the scene
function draw() {
    clear();
    ctx.setLineDash([0]);
    if (choice)
        drawGrid();
    // redraw each shapes in the nodes array
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

function SetDimension(){
    document.getElementById('myBox').style.height = window.innerHeight - $('li').height() - 20;
    //document.getElementById('myBox').style.width = $('li').width()*9;
    canvas.width = document.getElementById('myBox').offsetWidth + 1000; 
    canvas.height = document.getElementById('myBox').offsetHeight + 1000;
    $('li ul li a').css('width', $('li a').width());
    WIDTH = canvas.width;
    HEIGHT = canvas.height;
    draw();
}

function init() {
    // get canvas related references
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    SetCoordinates();
    SetDimension();
    // drag related variables
    dragok = false;
    // listen for mouse events
    canvas.onmousedown = myDown;
    canvas.onmouseup = myUp;
    canvas.onmousemove = myMove;
    canvas.ondblclick = myDoubleClick;
    window.onresize = SetDimension;
    InsertCopy([]); // insert into copy an empty array
    // call to draw the scene
    draw();
    SetMenuEvent();
}

window.onload = init;
