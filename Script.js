// get canvas related references
var canvas, ctx, nodes = [], BB, offsetX, offsetY, WIDTH, HEIGHT;
// drag related variables
var dragok, startX, startY;
var choice = false; // = true => grid, else false
var dim = 10; //indicate the dimension of the grid's squares
var trashX = 1075, trashY = 467, trashW = 30, trashH = 30; //size and position of trash used to delete element on canvas

function Menu() {
    document.getElementById("rect_img").onclick = function () { myClick("rectangle") };
    document.getElementById("line_img").onclick = function () { myClick("line") };
    document.getElementById("rhombus_img").onclick = function () { myClick("rhombus") };
    document.getElementById("parallelogram_img").onclick = function () { myClick("parallelogram") };
    document.getElementById("ellipse_img").onclick = function () { myClick("ellipse") };
    document.getElementById("rect_img").onmouseover = function () { myOver() };
    document.getElementById("line_img").onmouseover = function () { myOver() };
    document.getElementById("rhombus_img").onmouseover = function () { myOver() };
    document.getElementById("parallelogram_img").onmouseover = function () { myOver() };
    document.getElementById("ellipse_img").onmouseover = function () { myOver() };
    document.getElementById("rect_img").onmouseout = function () { myOut() };
    document.getElementById("line_img").onmouseout = function () { myOut() };
    document.getElementById("rhombus_img").onmouseout = function () { myOut() };
    document.getElementById("parallelogram_img").onmouseout = function () { myOut() };
    document.getElementById("ellipse_img").onmouseout = function () { myOut() };
    document.getElementById("myBox").onmouseup = function () { draw() };
    document.getElementById("myBox").onwheel = function () { draw() }; // on wheel is the event associated at the wheel's (of mouse) move
}

// handle onclick events
function myClick(t) {
    selected = t;
}

function myOver(t) {
    document.body.style.cursor = "pointer";
}

function myOut(t) {
    document.body.style.cursor = "default";
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
    choice = true;
}

function Choice() {
    if (grid.choice.checked)
        drawGrid();
    else {
        choice = false;
        draw();
    }
}

function Quantity() {
    dim = document.getElementsByName("quantity")[0].value * 10;
    clear();
    draw();
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
    // call to draw the scene
    draw();
    Menu();
}

function newRect(px, py) {
    //check if position of new rectangle go over the canvas
    if (px > WIDTH)
        return;
    nodes.push({ x: px - 15, y: py - 15, width: 110, height: 60, fill: "white", isDragging: false, id: "rectangle" });
    draw();
}

function newLine(px, py) {
    if (px > WIDTH)
        return;
    nodes.push({ x: px, y: py, width: px + 40, isDragging: false, id: "line" });
    draw();
}

function newRhombus(px, py) {
    //check if position of new rhombus go over the canvas
    if (px > WIDTH)
        return;
    nodes.push({ x: px - 15, y: py, radius: 50, fill: "white", width: 50, height: 50, isDragging: false, id: "rhombus" });
    draw();
}

function newParallelogram(px, py) {
    //check if position of new rhombus go over the canvas
    if (px > WIDTH)
        return;
    nodes.push({ x: px, y: py, fill: "white", width: 100, height: 70, isDragging: false, id: "parallelogram" });
    draw();
}

function newEllipse(px, py) {
    //check if position of new rhombus go over the canvas
    if (px > WIDTH)
        return;
    nodes.push({ x: px, y: py, radiusY: 25, radiusX: 50, fill: "white", isDragging: false, id: "ellipse" });
    draw();
}

function insideParallelogram(r, mx, my) {
    return (mx > (r.x + 22) && mx < (r.x + r.width + 20) && my < r.y && my > (r.y - (r.height - 20)));
}

function insideLine(r, mx, my) {
    return (mx > r.x && mx < r.width && Math.abs(my - r.y) < 4);
}

//( x - x_c )^2 / a^2 + ( y - y_c )^2 / b^2 < 1
function insideEllipse(r, mx, my) {
    var eq = (Math.pow((mx - r.x), 2) / Math.pow(r.radiusX, 2)); // radiusX è il semiasse orizzontale
    var eq2 = (Math.pow((my - r.y), 2) / Math.pow(r.radiusY, 2)); // radiusY è il semiasse verticale
    return (eq + eq2) < 1;
}

function insideRect(r, mx, my) {
    return (mx > r.x && mx < r.x + r.width && my > r.y && my < r.y + r.height);
}

//check if mouse is inside a rhombus
function insideRhombus(r, mx, my) {
    var centerX = ((r.x + r.radius) + (r.x - r.radius)) / 2;
    var centerY = ((r.y) + (r.y)) / 2;
    var dx = Math.abs(mx - centerX);
    var dy = Math.abs(my - centerY);
    var d = dx / r.width + dy / r.height;
    return d <= 1;
}

//draw a single polygon
function drawRhombus(r) {
    /*var sides = 4;
    var a = ((Math.PI * 2) / sides);
    ctx.beginPath();
    ctx.save();
    ctx.translate(r.x, r.y);
    ctx.moveTo(r.radius, 0);
    for (var i = 1; i < sides; i++) {
        ctx.lineTo(r.radius * Math.cos(a * i), r.radius * Math.sin(a * i));
    }
    ctx.closePath();
    ctx.stroke();
    ctx.restore();*/
    ctx.beginPath();
    ctx.moveTo(r.x, r.y + r.radius); // Top
    ctx.lineTo(r.x - r.radius, r.y); // Left
    ctx.lineTo(r.x, r.y - r.radius); // Bottom
    ctx.lineTo(r.x + r.radius, r.y); // Right
    //ctx.lineTo(r.x, r.y + r.radius); // Back to Top
    ctx.closePath();
    ctx.stroke();
}

// draw a single parallelogram
function drawParallelogram(r) {
    ctx.beginPath();
    ctx.moveTo(r.x, r.y);
    ctx.lineTo(r.x + r.width, r.y);
    ctx.lineTo(r.x + r.height + 60, r.y - 50);
    ctx.lineTo(r.x + r.height + 60 - r.width, r.y - 50);
    // ctx.lineTo(r.x + r.height + 50 - r.width, r.y - 50 + r.height);
    ctx.closePath();
    ctx.stroke();
}

// draw a single line
function drawLine(l) {
    ctx.beginPath();  //inizio il percorso
    ctx.moveTo(l.x, l.y);  //mi sposto senza disegnare
    ctx.lineTo(l.width, l.y); //disegno una linea dal punto (l.x, l.y) al punto (l.width,l.y)
    ctx.stroke();
}

// draw a single rect
function drawRect(x, y, w, h) {
    ctx.beginPath();
    ctx.rect(x, y, w, h);
}

// draw a single ellipse
function drawEllipse(r) {
    ctx.beginPath();
    ctx.ellipse(r.x, r.y, r.radiusY, r.radiusX, Math.PI / 2, 0, 2 * Math.PI);
    ctx.stroke();
}

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

// draw border
function border(width, color) {
    ctx.lineWidth = width;
    ctx.strokeStyle = "black";
    ctx.stroke();
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
        border(2, "black");
    }
    drawTrash();
}

// handle mousedown events
function myDown(e) {
    // tell the browser we're handling this mouse event
    e.preventDefault();
    e.stopPropagation();
    // get the current mouse position
    var mx = parseInt(e.clientX - offsetX);
    var my = parseInt(e.clientY - offsetY) + document.getElementById("myBox").scrollTop;
    //new object if i have press central key of mouse
    for (var i = 0; i < nodes.length; i++) {
        var r = nodes[i];
        if (e.button == 1) {
            if (r.id == "rectangle") {
                if (insideRect(r, mx, my))
                    newRect(mx + 50, my);
            }
            else if (r.id == "line") {
                if (insideLine(r, mx, my))
                    newLine(mx + 50, my);
            }
            else if (r.id == "parallelogram") {
                if (insideParallelogram(r, mx, my))
                    newParallelogram(mx + 50, my);
            }
            else if (r.id == "ellipse") {
                if (insideEllipse(r, mx, my))
                    newEllipse(mx + 50, my);
            }
            else if (r.id == "rhombus") {
                if (insideRhombus(r, mx, my))
                    newRhombus(mx + 100, my);
            }
            draw();
        }
    }
    // test each rect to see if mouse is inside
    dragok = false;
    for (var i = 0; i < nodes.length; i++) {
        var r = nodes[i];
        if (r.id == "parallelogram") {
            if (insideParallelogram(r, mx, my)) {
                dragok = true;
                r.isDragging = true;
                ChangeCursor("move", r.id);
            }
        }
        else if (r.id == "rectangle") {
            if (insideRect(r, mx, my)) {
                // if yes, set that rects isDragging=true
                dragok = true;
                r.isDragging = true;
                ChangeCursor("move", r.id);
            }
        }
        else if (r.id == "line") {
            if (insideLine(r, mx, my)) {
                dragok = true;
                r.isDragging = true;
                ChangeCursor("move", r.id);
            }
        }
        else if (r.id == "rhombus") {
            if (insideRhombus(r, mx, my)) {
                dragok = true;
                r.isDragging = true;
                ChangeCursor("move", r.id);
            }
        }
        else if (r.id == "ellipse") {
            if (insideEllipse(r, mx, my)) {
                dragok = true;
                r.isDragging = true;
                ChangeCursor("move", r.id);
            }
        }
    }
    // save the current mouse position
    startX = mx;
    startY = my;
}


// handle mouseup events
function myUp(e) {
    // tell the browser we're handling this mouse event
    e.preventDefault();
    e.stopPropagation();
    var mx = parseInt(e.clientX - offsetX);
    var my = parseInt(e.clientY - offsetY) + document.getElementById("myBox").scrollTop;
    //check if i have selected an object from menu
    if (selected != null) {
        if (selected == "rectangle")
            newRect(mx, my);
        else if (selected == "line")
            newLine(mx, my);
        else if (selected == "rhombus")
            newRhombus(mx, my);
        else if (selected == "parallelogram")
            newParallelogram(mx, my);
        else if (selected == "ellipse")
            newEllipse(mx, my);
        selected = null;
        draw();
        return;
    }
    // clear all the dragging flags
    dragok = false;
    for (var i = 0; i < nodes.length; i++) {
        nodes[i].isDragging = false;
    }
    ChangeCursor("default", "");
}

// show coordinates of mouse
function WriteCoordinates(mx, my) {
    var text = mx + "," + my;
    document.getElementById("coordinates").innerHTML = text;
}

// show the object where mouse is on and change the mouse's icon
function ChangeCursor(val, name) {
    if (val == "move")
        document.getElementById("typeObject").innerHTML = "It is a " + name;
    else
        document.getElementById("typeObject").innerHTML = "";
    document.body.style.cursor = val;
}

// handle mouse moves
function myMove(e) {
    // tell the browser we're handling this mouse event
    e.preventDefault();
    e.stopPropagation();
    // get the current mouse position
    var mx = parseInt(e.clientX - offsetX);
    var my = parseInt(e.clientY - offsetY) + document.getElementById("myBox").scrollTop;
    // if we're dragging anything...
    if (dragok) {
        // calculate the distance the mouse has moved
        // since the last mousemove
        var dx = mx - startX;
        var dy = my - startY;
        // move each rect that isDragging
        // by the distance the mouse has moved
        // since the last mousemove
        for (var i = 0; i < nodes.length; i++) {
            var r = nodes[i];
            if (r.isDragging) {
                r.x += dx;
                r.y += dy;
                if (r.id == "line")
                    r.width += dx;
                // check if a polygon is inside the "trash"
                if (mx > trashX && mx < trashX + trashW && my > trashY_act && my < trashY_act + trashH) {
                    // if yes, delete it
                    nodes.splice(i, 1);
                    ChangeCursor("default", "");
                }
            }
        }
        // redraw the scene with the new rect positions
        draw();
        // reset the starting mouse position for the next mousemove
        startX = mx;
        startY = my;
    }
    for (var i = 0; i < nodes.length; i++) {
        var r = nodes[i];
        if (r.id == "parallelogram") {
            if (insideParallelogram(r, mx, my)) {
                WriteCoordinates(mx, my);
                ChangeCursor("move", r.id);
                return;
            }
        }
        else if (r.id == "rectangle") {
            if (insideRect(r, mx, my)) {
                WriteCoordinates(mx, my);
                ChangeCursor("move", r.id);
                return;
            }
        }
        else if (r.id == "line") {
            if (insideLine(r, mx, my)) {
                WriteCoordinates(mx, my);
                ChangeCursor("move", r.id);
                return;
            }
        }
        else if (r.id == "rhombus") {
            if (insideRhombus(r, mx, my)) {
                WriteCoordinates(mx, my);
                ChangeCursor("move", r.id);
                return;
            }
        }
        else if (r.id == "ellipse") {
            if (insideEllipse(r, mx, my)) {
                WriteCoordinates(mx, my);
                ChangeCursor("move", r.id);
                return;
            }
        }
        ChangeCursor("default", "");
    }
    WriteCoordinates(mx, my);
}
/*function Click(e) {
    if (!textarea) {
        textarea = document.createElement('textarea');
        textarea.className = 'info';
        document.body.appendChild(textarea);
    }
    var mx = parseInt(e.clientX - offsetX);
    var my = parseInt(e.clientY - offsetY);
    textarea.value = "x: " + mx + " y: " + my;
    textarea.style.top = e.clientY + 'px';
    textarea.style.left = e.clientX + 'px';
}*/

window.onload = init;