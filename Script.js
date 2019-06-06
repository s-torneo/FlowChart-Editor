// get canvas related references
var canvas, ctx, nodes = [], BB, offsetX, offsetY, WIDTH, HEIGHT;
// drag related variables
var dragok, startX, startY;
var choice = false; // = true => grid, else false
var dim = 10; //indicate the dimension of the grid's squares
var trashX = 1075, trashY = 467, trashW = 30, trashH = 30; //size and position of trash used to delete element on canvas

var trashY_actual = 467, endY = 767;
//draw trash
function drawTrash() {
    const image = document.getElementById('trash');
    var rid = document.getElementById("myBox").scrollTop;
    trashY_act = trashY + rid;
    if (trashY_act > (HEIGHT - 40))
        ctx.drawImage(image, trashX, endY, trashW, trashH);
    else
        ctx.drawImage(image, trashX, trashY + rid, trashW, trashH);
}

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
    nodes.splice(0, nodes.length);
    draw();
}

// clear the canvas
function clear() {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    ctx.fillStyle = "aliceblue"; //"#FAF7F8"
    drawRect(0, 0, WIDTH, HEIGHT);
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
            drawRect(r.x, r.y, r.width, r.height);
        else if (r.id == "line")
            drawLine(r);
        else if (r.id == "rhombus")
            drawRhombus(r);
        else if (r.id == "parallelogram")
            drawParallelogram(r);
        else if (r.id == "ellipse")
            drawEllipse(r);
        else if (r.id == "text")
            drawText(r);
    }
    drawTrash();
}

function init() {
    // get canvas related references
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    BB = canvas.getBoundingClientRect();
    offsetX = BB.left;
    offsetY = BB.top;
    WIDTH = canvas.width;
    HEIGHT = canvas.height;
    // drag related variables
    dragok = false;
    // listen for mouse events
    canvas.onmousedown = myDown;
    canvas.onmouseup = myUp;
    canvas.onmousemove = myMove;
    canvas.ondblclick = myDoubleClick;
    // call to draw the scene
    draw();
    Menu();
}

window.onload = init;