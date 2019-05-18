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
    document.getElementById("rect_img").onmouseover = function () { myOver() };
    document.getElementById("line_img").onmouseover = function () { myOver() };
    document.getElementById("rhombus_img").onmouseover = function () { myOver() };
    document.getElementById("parallelogram_img").onmouseover = function () { myOver() };
    document.getElementById("rect_img").onmouseout = function () { myOut() };
    document.getElementById("line_img").onmouseout = function () { myOut() };
    document.getElementById("rhombus_img").onmouseout = function () { myOut() };
    document.getElementById("parallelogram_img").onmouseout = function () { myOut() };
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
    nodes.push({ x: px - 15, y: py - 15, width: 50, height: 30, fill: "white", isDragging: false, id: "rectangle" });
    draw();
}

function newLine(px, py) {
    //aggiungere controllo
    nodes.push({ x: px, y: py, width: px + 40, isDragging: false, id: "line" });
    draw();
}

function newRhombus(px, py) {
    //check if position of new rhombus go over the canvas
    if (px > WIDTH)
        return;
    nodes.push({ x: px - 15, y: py, radius: 30, fill: "white", width: 30, height: 30, isDragging: false, id: "rhombus" });
    draw();
}

function newParallelogram(px, py) {
    //check if position of new rhombus go over the canvas
    if (px > WIDTH)
        return;
    nodes.push({ x: px, y: py, fill: "white", width: 100, height: 70, isDragging: false, id: "parallelogram" });
    draw();
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
function rhombus(r) {
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
function parallelogram(r) {
    ctx.beginPath();
    ctx.moveTo(r.x, r.y);
    ctx.lineTo(r.x + r.width, r.y);
    ctx.lineTo(r.x + r.height + 60, r.y - 50);
    ctx.lineTo(r.x + r.height + 60 - r.width, r.y - 50);
   // ctx.lineTo(r.x + r.height + 50 - r.width, r.y - 50 + r.height);
    ctx.closePath();
    ctx.stroke();
}

/* A = (r.x,r.y)
 * B = (r.x + r.width, r.y)
 * C = (r.x + r.height + 60 - r.width, r.y - 50)
*/
function insideParallelogram(r,mx,my) {
    var D1 = (mx - r.x) * ((r.y - 50) - r.y) - (my - r.y) * ((r.x + r.height + 60 - r.width) - r.x);

    var D2 = (r.x-m.x)* (r.y - r.y) - (r.y - m.y) * ((r.x + r.width) - r.x);

    var D = ((r.x + r.width) - r.x) * ((r.y - 50) - r.y) - (r.y - r.y) * ((r.x + r.height + 60 - r.width) - r.x);

    var a = D1 * D; var b = D2 * D;

    if (a > 0 && b > 0 && (a + b) < 1)
        return true;
    return false;
}

// draw a single line
function line(l) {
    ctx.beginPath();  //inizio il percorso
    ctx.moveTo(l.x, l.y);  //mi sposto senza disegnare
    ctx.lineTo(l.width, l.y); //disegno una linea dal punto (l.x, l.y) al punto (l.width,l.height)
    ctx.stroke();
}

// draw a single rect
function rect(x, y, w, h) {
    ctx.beginPath();
    ctx.rect(x, y, w, h);
    ctx.closePath();
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
    rect(0, 0, WIDTH, HEIGHT);
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
            rect(r.x, r.y, r.width, r.height);
        else if (r.id == "line")
            line(r);
        else if (r.id == "rhombus")
            rhombus(r);
        else if (r.id == "parallelogram")
            parallelogram(r);
        border(2, "black");
    }
    //draw trash
    const image = document.getElementById('trash');
    ctx.drawImage(image, trashX, trashY, trashW, trashH);
}

// handle mousedown events
function myDown(e) {
    // tell the browser we're handling this mouse event
    e.preventDefault();
    e.stopPropagation();
    // get the current mouse position
    var mx = parseInt(e.clientX - offsetX);
    var my = parseInt(e.clientY - offsetY);
    //new object if i have press central key of mouse
    for (var i = 0; i < nodes.length; i++) {
        var r = nodes[i];
        if (e.button == 1) {
            if (r.id == "rhombus") {
                if (insideRhombus(r,mx,my))
                    newRhombus(mx + 50, my);
            }
            else if (r.id == "rectangle"){
                if (mx > r.x && mx < r.x + r.width && my > r.y && my < r.y + r.height)
                    newRect(mx + 50, my);
            }
            /*else if (r.id == "parallelogram") {
                if (insideParallelogram(r,mx, my))
                    newParallelogram(mx + 50, my);
            }*/
        }
        draw();
    }
    // test each rect to see if mouse is inside
    dragok = false;
    for (var i = 0; i < nodes.length; i++) {
        var r = nodes[i];
        /*if (r.id == "parallelogram") {
            if (insideParallelogram(r,mx, my)) {
                dragok = true;
                r.isDragging = true;
                ChangeCursor("move", r.id);
            }
        }
        else */if (r.id == "rectangle") {
            if (mx > r.x && mx < r.x + r.width && my > r.y && my < r.y + r.height) {
                // if yes, set that rects isDragging=true
                dragok = true;
                r.isDragging = true;
                ChangeCursor("move", r.id);
            }
        }
        else if (r.id == "line") {
            if (mx > r.x && mx < r.x + r.width && my == r.y) {
                dragok = true;
                r.isDragging = true;
                ChangeCursor("move", r.id);
            }
        }
        else {
            if (insideRhombus(r, mx, my)) {
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
    var my = parseInt(e.clientY - offsetY);
    //check if i have selected an object from menu
    if (selected != null) {
        if (selected == "rectangle")
            newRect(mx, my);
        if (selected == "line")
            newLine(mx, my);
        if (selected == "rhombus")
            newRhombus(mx, my);
        if (selected == "parallelogram")
            newParallelogram(mx, my);
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
function WriteCoordinates(mx,my) {
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
    var my = parseInt(e.clientY - offsetY);
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
                // check if a polygon is inside the "trash"
                if (mx > trashX && mx < trashX + trashW && my > trashY && my < trashY + trashH) {
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
        /*if (r.id == "parallelogram") {
            if (insideParallelogram(r,mx, my)) {
                WriteCoordinates(mx, my);
                ChangeCursor("move", r.id);
                return;
            }
        }
        else */if (r.id == "rectangle") {
            if (mx > r.x && mx < r.x + r.width && my > r.y && my < r.y + r.height) {
                WriteCoordinates(mx, my);
                ChangeCursor("move", r.id);
                return;
            }
        }
        else if (r.id == "line") {
            if (mx > r.x && mx < r.x + r.width && my == r.y) {
                WriteCoordinates(mx, my);
                ChangeCursor("move", r.id);
                return;
            }
        }
        else if (r.id == "rhombus"){
            if (insideRhombus(r, mx, my)) {
                WriteCoordinates(mx, my);
                ChangeCursor("move", r.id);
                return;
            }
        }
        ChangeCursor("default", "");
    }
    WriteCoordinates(mx,my);
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