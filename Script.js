// get canvas related references
var canvas, ctx, nodes = [], copy = [], BB, offsetX, offsetY, WIDTH, HEIGHT;
// drag related variables
var dragok, startX, startY;
var choice = false; // = true => grid, else false
var dim = 10; //indicate the dimension of the grid's squares
var trashX = 1065, trashY = 467, trashW = 30, trashH = 30; //size and position of trash used to delete element on canvas

function aroundTrash(mx, my) {
    if (Math.abs(mx - trashX) < 100 && Math.abs(my - trashY_actual) < 100) {
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
    if (mx > trashX && mx < trashX + trashW && my > trashY_actual && my < trashY_actual + trashH) {
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

var trashY_actual = 467, endY = 767, endY2 = 743, endY3 = -1080, degrees = 0;
//draw trash
function drawTrash() {
    const trash_down = document.getElementById('trash_down');
    const trash_up = document.getElementById('trash_up');
    var rid = document.getElementById("myBox").scrollTop;
    trashY_actual = trashY + rid;
    ctx.globalAlpha = 1.0;
    ctx.save();
    // move to the center of the canvas
    ctx.translate(trashW / 2, trashH / 2);
    // rotate the canvas to the specified degrees
    ctx.rotate(degrees*Math.PI / 180);
    // draw trash_up
    if (degrees == 90) {
        if (trashY_actual > (HEIGHT - 40))
            ctx.drawImage(trash_up, trashX - 334, endY3, 20, 10);
        else
            ctx.drawImage(trash_up, 431 + rid, -(trashY * 2 + 145), 20, 10);
    }
    else {
        if (trashY_actual > (HEIGHT - 40))
            ctx.drawImage(trash_up, trashX - 15, endY2, 20, 10);
        else
            ctx.drawImage(trash_up, trashX - 15, trashY - 25 + rid, 20, 10);
    }
    ctx.restore();
    // draw trash_down
    if (trashY_actual > (HEIGHT - 40))
        ctx.drawImage(trash_down, trashX, endY, 20,20);
    else
        ctx.drawImage(trash_down, trashX, trashY + rid, 20,20);
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