function newRect(px, py) {
    //check if position of new rectangle go over the canvas
    if (px > WIDTH)
        return;
    nodes.push({ x: px - 15, y: py - 15, width: 110, height: 60, fill: "white", isDragging: false, resize: -1, id: "rectangle" });
    draw();
}

function newLine(px, py) {
    if (px > WIDTH)
        return;
    nodes.push({ x: px, y: py, width: 40, isDragging: false, id: "line" });
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

//check if mouse's pointer is inside a parallelogram
function insideParallelogram(r, mx, my) {
    return (mx > (r.x + 22) && mx < (r.x + r.width + 20) && my < r.y && my > (r.y - (r.height - 20)));
}

//check if mouse's pointer is on a line
function insideLine(r, mx, my) {
    return (mx > r.x && mx < (r.width+r.x) && Math.abs(my - r.y) < 4);
}

//check if mouse's pointer is inside an ellipse
function insideEllipse(r, mx, my) {
    //( x - x_c )^2 / a^2 + ( y - y_c )^2 / b^2 < 1
    var eq = (Math.pow((mx - r.x), 2) / Math.pow(r.radiusX, 2)); // radiusX è il semiasse orizzontale
    var eq2 = (Math.pow((my - r.y), 2) / Math.pow(r.radiusY, 2)); // radiusY è il semiasse verticale
    return (eq + eq2) < 1;
}

//check if mouse's pointer is inside a rectangle
function insideRect(r, mx, my) {
    return (mx > r.x && mx < (r.x + r.width + 10) && my > r.y && my < (r.y + r.height + 10));
}

//check if mouse's pointer is inside a rhombus
function insideRhombus(r, mx, my) {
    var centerX = ((r.x + r.radius) + (r.x - r.radius)) / 2;
    var centerY = ((r.y) + (r.y)) / 2;
    var dx = Math.abs(mx - centerX);
    var dy = Math.abs(my - centerY);
    var d = dx / r.width + dy / r.height;
    return d <= 1;
}

// draw border
function border(width, color) {
    ctx.lineWidth = width;
    ctx.strokeStyle = "black";
    ctx.stroke();
}

// draw a single rhombus
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
    border(2, "black");
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
    border(2, "black");
}

// draw a single line
function drawLine(l) {
    ctx.beginPath();  //inizio il percorso
    ctx.moveTo(l.x, l.y);  //mi sposto senza disegnare
    ctx.lineTo(l.x + l.width, l.y); //disegno una linea dal punto (l.x, l.y) al punto (l.width,l.y)
    ctx.stroke();
    border(2, "black");
}

// draw a single recta ngle
function drawRect(x, y, w, h) {
    ctx.beginPath();
    ctx.rect(x, y, w, h);
    border(2, "black");
}

// draw a single ellipse
function drawEllipse(r) {
    ctx.beginPath();
    ctx.ellipse(r.x, r.y, r.radiusY, r.radiusX, Math.PI / 2, 0, 2 * Math.PI);
    ctx.stroke();
    border(2, "black");
}

// draw a single circle
function drawCircle(r, posx, posy) {
    ctx.beginPath();
    ctx.ellipse(r.x + posx, r.y + posy, 3, 3, Math.PI / 2, 0, 2 * Math.PI);
    ctx.stroke();
    border(1, "black");
    ctx.fillStyle = "blue";
    ctx.fill();
}

// check the value resize of the polygon and resize it
function ResizeRect(r, dx, dy) {
    if (r.resize == 0)
        r.width -= dx;
    else if (r.resize == 1)
        r.width += dx;
    else if (r.resize == 2)
        r.height -= dy;
    else if (r.resize == 3)
        r.height += dy;
}

// check if mouse's pointer is on a resizing point
function CheckResizeRect(r, mx, my) {
    if (Math.abs(mx - r.x) < 4 && Math.abs(my - (r.y + (r.height / 2))) < 4) {
        r.resize = 0;
        ChangeCursor("e-resize", r.id);
    }
    else if (Math.abs(mx - (r.x + r.width)) < 10 && Math.abs(my - (r.y + (r.height / 2))) < 10) {
        r.resize = 1;
        ChangeCursor("e-resize", r.id);
    }
    else if (Math.abs(mx - (r.x + r.width / 2)) < 4 && Math.abs(my - r.y) < 4) {
        r.resize = 2;
        ChangeCursor("ns-resize", r.id);
    }
    else if (Math.abs(mx - (r.x + r.width / 2)) < 4 && Math.abs(my - (r.y + r.height)) < 4) {
        r.resize = 3;
        ChangeCursor("ns-resize", r.id);
    }
    else {
        r.resize = -1;
    }
}