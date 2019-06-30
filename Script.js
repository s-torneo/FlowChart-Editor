// get canvas related references
var canvas, ctx, nodes = [], copy = [], BB, offsetX, offsetY, WIDTH, HEIGHT;
// drag related variables
var dragok, startX, startY;
var choice = false; // = true => grid, else false
var dim = 10; //indicate the dimension of the grid's squares
var trashX = 1065, trashY = 467, trashW = 30, trashH = 30; //size and position of trash used to delete element on canvas
var trashY_actual, trashX_actual, degrees = 0; // used to manage the drawing of trash

function aroundTrash(mx, my) {
    if (Math.abs(mx - trashX_actual) < 100 && Math.abs(my - trashY_actual) < 100) {
        degrees = 90;
        draw();
        setTimeout(function () {
            degrees = 0;
            draw();
        }, 2000);
    }
}

function RemoveShape(i){
    var r = nodes[i];
    // save it in copy with the initial position x e y and then delete it
    r.x =  r.initX;
    r.y = r.initY;
    r.isDragging = false;
    r.isSelected = false;
    r.trasparence = 1.0;
    copy.push(r);
    removed = true;
    nodes.splice(i, 1);
}

function insideTrash(mx, my, i) {
    if (mx > trashX_actual && mx < trashX_actual + trashW && my > trashY_actual && my < trashY_actual + trashH) {
        if(selectionMode){
            for(var i = 0; i < nodes.length; i++){
                var r = nodes[i];
                if(insideRectSelection(r.x,r.y) && r.id != "selection" && !selectionok && r.isSelected)
                    RemoveShape(i);
            }
        }
        else
            RemoveShape(i);
        ChangeCursor("default");
    }
}

//draw trash
function drawTrash() {
    const trash_lower = document.getElementById('trash_down');
    const trash_above = document.getElementById('trash_up');
    var scrolly = parseInt(document.getElementById("myBox").scrollTop);
    var scrollx = parseInt(document.getElementById("myBox").scrollLeft);
    trashY_actual = trashY + scrolly;
    trashX_actual = trashX + scrollx;
    ctx.globalAlpha = 1.0;
    ctx.save();
    // move to the center of the trash image
    ctx.translate(trashW / 2, trashH / 2);
    // rotate the canvas to the specified degrees
    ctx.rotate(degrees*Math.PI / 180);
    // draw the above part of trash
    if (degrees == 90)
        ctx.drawImage(trash_above, 431 + scrolly, -(trashY * 2 + 145 + scrollx), 20, 10);
    else
        ctx.drawImage(trash_above, trashX - 15 + scrollx, trashY - 25 + scrolly, 20, 10);
    ctx.restore();
    // draw the lower part of trash
    ctx.drawImage(trash_lower, trashX + scrollx, trashY + scrolly, 20,20);
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

// they are used to manage undo, redo and reset operations
var flag = false, removed = false;
  
// reset the canvas
function reset() {
    for (var i = 0; i < nodes.length; i++){
        var r = nodes[i];
        if(r.id != "selection"){
            r.trasparence = 1.0;
            copy.push(r);
        }
    }
    nodes.splice(0, nodes.length);
    draw();
    flag = true;
    selectionok = selectionMode = false;
}

function undo() {
    if (nodes.length > 0) {
        copy.push(nodes[nodes.length - 1]);
        nodes.pop();
        draw();
    }
}

function redo() {
    if (copy.length > 0) {
        nodes.push(copy[copy.length - 1]);
        copy.pop();
        draw();
    }
}

// clear the canvas
function clear() {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
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
    if (removed)
        flag = true;
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
    // call to draw the scene
    draw();
    Menu();
}

window.onload = init;