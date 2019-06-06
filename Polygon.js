function newRect(px, py) {
    //check if position of new rectangle go over the canvas
    if (px > WIDTH)
        return;
    nodes.push({ x: px - 15, y: py - 15, width: 110, height: 60, fill: "white", isDragging: false, resize: -1, id: "rectangle" });
}

function newLine(px, py) {
    if (px > WIDTH)
        return;
    nodes.push({ x: px, y: py, width: 40, isDragging: false, resize: -1, /*rotate: 0,*/ id: "line" });
}

function newRhombus(px, py) {
    //check if position of new rhombus go over the canvas
    if (px > WIDTH)
        return;
    nodes.push({ x: px - 15, y: py, radius: 50, fill: "white", width: 50, height: 50, isDragging: false, resize: -1, id: "rhombus" });
}

function newParallelogram(px, py) {
    //check if position of new rhombus go over the canvas
    if (px > WIDTH)
        return;
    nodes.push({ x: px, y: py, fill: "white", width: 100, height: 70, isDragging: false, id: "parallelogram" });
}

function newEllipse(px, py) {
    //check if position of new rhombus go over the canvas
    if (px > WIDTH)
        return;
    nodes.push({ x: px, y: py, radiusY: 25, radiusX: 50, fill: "white", isDragging: false, resize: -1, id: "ellipse" });
}

function newRotationIcon(px, py) {
    nodes.push({ x: px, y: py, width: 10, height: 10, id: "rotate" });
}

function newText(px, py){
    if (px > WIDTH)
        return;
    nodes.push({ x: px - 15, y: py - 15, width: 40, height: 30, fill: "white", borderColor: "green", text: "Text", input: false, isDragging: false, resize: -1, id: "text" });
}

//check if mouse's pointer is inside a parallelogram
function insideParallelogram(r, mx, my) {
    return (mx > (r.x + 22) && mx < (r.x + r.width + 20) && my < r.y && my > (r.y - (r.height - 20)));
}

//check if mouse's pointer is on a line
function insideLine(r, mx, my) {
    return (mx > r.x && mx < (r.width + r.x) && Math.abs(my - r.y) < 15); // prima era < 4
}

function insideRotationIcon(r, mx, my) {
    return (Math.abs(mx - (r.x + (r.width / 2))) < 15 && Math.abs(my - (r.y - 20)) < 10);
}

//check if mouse's pointer is inside an ellipse
function insideEllipse(r, mx, my) {
    //( x - x_c )^2 / a^2 + ( y - y_c )^2 / b^2 < 1
    var eq = (Math.pow((mx - r.x), 2) / Math.pow(r.radiusX, 2)); // radiusX è il semiasse orizzontale
    var eq2 = (Math.pow((my - r.y), 2) / Math.pow(r.radiusY, 2)); // radiusY è il semiasse verticale
    return (eq + eq2) < 1.3;
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
    return d <= 1.2;
}

// draw border
function border(width, color) {
    ctx.lineWidth = width;
    ctx.strokeStyle = color;
    ctx.stroke();
}

// draw a single rhombus
function drawRhombus(r) {
    ctx.beginPath();
    ctx.moveTo(r.x, r.y + r.height); // Top
    ctx.lineTo(r.x - r.width, r.y); // Left
    ctx.lineTo(r.x, r.y - r.height); // Bottom
    ctx.lineTo(r.x + r.width, r.y); // Right
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

function rotateLine(r) {
    var centerX = r.x + (r.width / 2);
    ctx.save();
    // translate to midpoint
    ctx.translate(centerX, r.y);
    // rotate some angle (radians)
    ctx.rotate(Math.PI / 2);  // = 90°
    drawLine(r);
    // translate back
    //ctx.translate(-centerX, -r.y);
    ctx.restore();
    /* else try this solution
    r.rotate += 10;
    draw();*/
}

// draw a single line
function drawLine(r) {
    ctx.beginPath();  //inizio il percorso
    ctx.moveTo(r.x, r.y);  //mi sposto senza disegnare
    ctx.lineTo(r.x + r.width, r.y /* + r.rotate */); //disegno una linea dal punto (l.x, l.y) al punto (l.width, l.y)
    ctx.stroke();
    ctx.closePath();
    border(2, "black");
}

// draw a single rectangle
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

// draw a single textarea
function drawText(r) {
    ctx.beginPath();
    ctx.rect(r.x, r.y, r.width, r.height);
    border(1, r.borderColor);
    ctx.font = "15px Comic Sans MS";
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.fillText(r.text, r.x + r.width / 2, r.y + r.height / 2); 
}

// check the size of a rectangle, rhombus or line and return true if the size has been modified
function CheckRectSize(r) {
    var t = false;
    if (r.width <= 20) {
        r.width++;
        t = true;
    }
    else if (r.height <= 20) {
        r.height++;
        t = true;
    }
    return t;
}

// check the value resize of a rectangle o a line and resize it
function ResizeRect(r, dx, dy) {
    switch (r.resize) {
        case 0: {
            if (!CheckRectSize(r)) // non basta controllare solo questo (se vado veloce mi sballa tutto il rettangolo)
                r.width -= dx;
        } break;
        case 1: {
            if (!CheckRectSize(r)) {
                r.x -= dx;
                r.y -= dy;
                r.width += dx;
            }
        } break;
        case 2: {
            if (!CheckRectSize(r))
                r.height -= dy;
        } break;
        case 3: {
            if (!CheckRectSize(r)) {
                r.x -= dx;
                r.y -= dy;
                r.height += dy;
            }
        } break;
        case 4: {
            if (!CheckRectSize(r)) {
                r.width -= dx;
                r.height -= dy;
            }
        } break;
        case 5: {
            if (!CheckRectSize(r)) {
                r.x -= dx;
                r.width += dx;
                r.height -= dy;
            }
        } break;
        case 6: {
            if (!CheckRectSize(r)) {
                r.y -= dy;
                r.width -= dx;
                r.height += dy;
            }
        } break;
        case 7: {
            if (!CheckRectSize(r)) {
                r.x -= dx;
                r.y -= dy;
                r.width += dx;
                r.height += dy;
            }
        } break;
    }
}

function ResizeRhombus(r, dx, dy) {
    r.x -= dx;
    r.y -= dy;
    switch (r.resize) {
        case 0: {
            if (!CheckRectSize(r)) // non basta controllare solo questo (se vado veloce mi sballa tutto il rombo)
                r.width += dx;
        } break;
        case 1: {
            if (!CheckRectSize(r))
                r.width -= dx;
        } break;
        case 2: {
            if (!CheckRectSize(r))
                r.height += dy;
        } break;
        case 3: {
            if (!CheckRectSize(r))
                r.height -= dy;
        } break;
    }
}

function CheckEllipseSize(r) {
    var t = false;
    if (r.radiusX <= 20) {
        r.radiusX++;
        t = true;
    }
    else if (r.radiusY <= 20) {
        r.radiusY++;
        t = true;
    }
    return t;
}

function ResizeEllipse(r, dx, dy) {
    r.x -= dx;
    r.y -= dy;
    switch (r.resize) {
        case 0: {
            if (!CheckEllipseSize(r)) // non basta controllare solo questo (se vado veloce mi sballa tutto l'ellisse)
                r.radiusY += dy;
        } break;
        case 1: {
            if (!CheckEllipseSize(r))
                r.radiusY -= dy;
        } break;
        case 2: {
            if (!CheckEllipseSize(r))
                r.radiusX += dx;
        } break;
        case 3: {
            if (!CheckEllipseSize(r))
                r.radiusX -= dx;
        } break;
    }
}

function ResizeParallelogram(r, dx, dy) {
    switch (r.resize) {
        case 1: {
            //if (!CheckEllipseSize(r))
            //r.x -= dx;
            //r.y -= dy;
            r.width += dx;
            r.height += dy;
        } break;
    }
}

// check if mouse inside a shape on one of the resizing points, if yes resize the shape
function ResizeShapes(r, mx, my, dx, dy) {
    if (insideRect(r, mx, my) || insideLine(r, mx, my))
        ResizeRect(r, dx, dy);
    else if (insideRhombus(r, mx, my))
        ResizeRhombus(r, dx, dy);
    else if (insideEllipse(r, mx, my))
        ResizeEllipse(r, dx, dy);
    else if (insideParallelogram(r, mx, my))
        ResizeParallelogram(r, dx, dy);
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
    else if (Math.abs(mx - (r.x + r.width / 2)) < 10 && Math.abs(my - (r.y + r.height)) < 10) {
        r.resize = 3;
        ChangeCursor("ns-resize", r.id);
    }
    else if (Math.abs(mx - r.x) < 4 && Math.abs(my - r.y) < 4) {
        r.resize = 4;
        ChangeCursor("nwse-resize", r.id);
    }
    else if (Math.abs(mx - (r.x + r.width)) < 4 && Math.abs(my - r.y) < 4) {
        r.resize = 5;
        ChangeCursor("nesw-resize", r.id);
    }
    else if (Math.abs(mx - r.x) < 4 && Math.abs(my - (r.y + r.height)) < 4) {
        r.resize = 6;
        ChangeCursor("nesw-resize", r.id);
    }
    else if (Math.abs(mx - (r.x + r.width)) < 4 && Math.abs(my - (r.y + r.height)) < 4) {
        r.resize = 7;
        ChangeCursor("nwse-resize", r.id);
    }
    else {
        r.resize = -1;
    }
}

// check if mouse's pointer is on a resizing point
function CheckResizeLine(r, mx, my) {
    if (Math.abs(mx - r.x) < 4 && Math.abs(my - r.y) < 4) {
        r.resize = 0;
        ChangeCursor("e-resize", r.id);
    }
    else if (Math.abs(mx - (r.x + r.width)) < 10 && Math.abs(my - r.y) < 10) {
        r.resize = 1;
        ChangeCursor("e-resize", r.id);
    }
    else {
        r.resize = -1;
    }
}

// check if mouse's pointer is on a resizing point
function CheckResizeRhombus(r, mx, my) {
    if (Math.abs(mx - (r.x + r.width)) < 4 && Math.abs(my - r.y) < 4) {
        r.resize = 0;
        ChangeCursor("e-resize", r.id);
    }
    else if (Math.abs(mx - (r.x - r.width)) < 4 && Math.abs(my - r.y) < 4) {
        r.resize = 1;
        ChangeCursor("e-resize", r.id);
    }
    else if (Math.abs(mx - r.x) < 4 && Math.abs(my - (r.y + r.height)) < 4) {
        r.resize = 2;
        ChangeCursor("ns-resize", r.id);
    }
    else if (Math.abs(mx - r.x) < 4 && Math.abs(my - (r.y - r.height)) < 4) {
        r.resize = 3;
        ChangeCursor("ns-resize", r.id);
    }
    else {
        r.resize = -1;
    }
}

// check if mouse's pointer is on a resizing point
function CheckResizeEllipse(r, mx, my) {
    if (Math.abs(mx - r.x) < 4 && Math.abs(my - (r.y + r.radiusY)) < 4) { // point down
        r.resize = 0;
        ChangeCursor("ns-resize", r.id);
    }
    else if (Math.abs(mx - r.x) < 4 && Math.abs(my - (r.y - r.radiusY)) < 4) { // point up
        r.resize = 1;
        ChangeCursor("ns-resize", r.id);
    }
    else if (Math.abs(mx - (r.x + r.radiusX)) < 4 && Math.abs(my - r.y) < 4) { // point dx
        r.resize = 2;
        ChangeCursor("e-resize", r.id);
    }
    else if (Math.abs(mx - (r.x - r.radiusX)) < 4 && Math.abs(my - r.y) < 4) { // point sx
        r.resize = 3;
        ChangeCursor("e-resize", r.id);
    }
    else {
        r.resize = -1;
    }
}

// check if mouse's pointer is on a resizing point
function CheckResizeParallelogram(r, mx, my) {
    if (Math.abs(mx - r.x) < 4 && Math.abs(my - r.y) < 4) {
        r.resize = 0;
        ChangeCursor("nwse-resize", r.id);
    }
    else if (Math.abs(mx - (r.x + r.width)) < 4 && Math.abs(my - r.y) < 4) {
        r.resize = 1;
        ChangeCursor("nwse-resize", r.id);
    }
    else if (Math.abs(mx - (r.x + r.height + 60)) < 4 && Math.abs(my - (r.y - 50)) < 4) {
        r.resize = 2;
        ChangeCursor("nesw-resize", r.id);
    }
    else if (Math.abs(mx - (r.x + (r.width + 35) / 2)) < 4 && Math.abs(my - (r.y - (r.height - 15) / 2) < 4)) {
        r.resize = 3;
        ChangeCursor("nwse-resize", r.id);
    }
    else {
        r.resize = -1;
    }
}

function drawParallelogramPoints(r) {
    drawCircle(r, 0, 0);
    drawCircle(r, r.width, 0);
    drawCircle(r, r.height + 60, -50);
    drawCircle(r, r.height + 60 - r.width, -50);
    drawCircle(r, (r.width + 35) / 2, -(r.height - 15) / 2); // center
}

function drawRectPoints(r) {
    drawCircle(r, 0, r.height / 2);
    drawCircle(r, r.width, r.height / 2);
    drawCircle(r, r.width / 2, 0);
    drawCircle(r, r.width / 2, r.height);
    if (r.id != "text")
        drawCircle(r, r.width / 2, r.height / 2); // center
    drawCircle(r, 0, 0); // angle sx-up
    drawCircle(r, 0 + r.width, 0); // angle dx
    drawCircle(r, 0, r.height); // angle sx-down
    drawCircle(r, r.width, r.height); // angle dx-down
}

// draw a rotation icon
function drawRotationIcon(r) {
    const image = document.getElementById('rotate');
    var rid = document.getElementById("myBox").scrollTop;
    // var ri = newRotationIcon(r.x + r.width / 2, r.y - 20);
    ctx.drawImage(image, r.x + r.width / 2, r.y - 20, 10, 10);
}

function drawLinePoints(r) {
    drawCircle(r, 0, 0);
    drawCircle(r, r.width, 0);
    drawCircle(r, r.width / 2, 0); // center
}

function drawRhombusPoints(r) {
    drawCircle(r, 0, r.height);
    drawCircle(r, 0, -r.height);
    drawCircle(r, r.width, 0);
    drawCircle(r, -r.width, 0);
    drawCircle(r, 0, 0); // center
}

function drawEllipsePoints(r) {
    drawCircle(r, 0, r.radiusY);
    drawCircle(r, 0, -r.radiusY);
    drawCircle(r, r.radiusX, 0);
    drawCircle(r, -r.radiusX, 0);
    drawCircle(r, 0, 0); // center
}