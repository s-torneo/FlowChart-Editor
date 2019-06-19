function newRect(px, py) {
    //check if position of new rectangle go over the canvas
    if (px > WIDTH)
        return;
    nodes.push({ x: px - 15, y: py - 15, width: 110, height: 60, isDragging: false, isSelected: false, resize: -1, id: "rectangle" });
}

function newLine(px, py, id_v) {
    if (px > WIDTH)
        return;
    nodes.push({ x: px, y: py, width: 40, isDragging: false, isSelected: false, resize: -1, degrees: 0, id: id_v});
}

function newRhombus(px, py) {
    //check if position of new rhombus go over the canvas
    if (px > WIDTH)
        return;
    nodes.push({ x: px - 15, y: py, radius: 50, width: 50, height: 50, isDragging: false, isSelected: false, resize: -1, id: "rhombus" });
}

function newParallelogram(px, py) {
    //check if position of new rhombus go over the canvas
    if (px > WIDTH)
        return;
    nodes.push({ x: px, y: py, width: 120, height: 70, h: 0, isDragging: false, isSelected: false, id: "parallelogram" });
}

function newEllipse(px, py) {
    //check if position of new rhombus go over the canvas
    if (px > WIDTH)
        return;
    nodes.push({ x: px, y: py, radiusY: 25, radiusX: 50, isDragging: false, isSelected: false, resize: -1, id: "ellipse" });
}

function newText(px, py) {
    if (px > WIDTH)
        return;
    nodes.push({ x: px - 15, y: py - 15, width: 40, height: 30, borderColor: "green", text: "Text", input: false, isDragging: false, isSelected: false, resize: -1, id: "text" });
}

//check if mouse's pointer is inside a parallelogram
function insideParallelogram(r, mx, my) {
    //drawCircle(r, -r.x + r.height * Math.cos(-45 * Math.PI / 180) + (r.x + r.width) - r.width - r.height / 3, -r.y + r.height * Math.sin(-45 * Math.PI / 180) + r.y + r.height / 3);
    return (mx > (r.height * Math.cos(-45 * Math.PI / 180) + (r.x + r.width) - r.width - r.height / 3) && my > (r.height * Math.sin(-45 * Math.PI / 180) + r.y - 5) && my < r.y && mx < (r.height * Math.cos(-45 * Math.PI / 180) + (r.x + r.width)));
}

//check if mouse's pointer is on a line
function insideLine(r, mx, my) {
    var inside = false;
    var x1 = r.x, y1 = r.y;
    var x2 = r.width * Math.cos(r.degrees * Math.PI / 180) + r.x;
    var y2 = r.width * Math.sin(r.degrees * Math.PI / 180) + r.y;
    if(mx>=x1 && mx<=x2 && Math.abs(my - y1)<20) // 0 
        inside = true;
    else if(my>=y1 && my<=y2 && Math.abs(mx - x1)<20) // 90
        inside = true;
    else if(mx<=x1 && mx>=x2 && Math.abs(my - y1)<20) // 180
        inside = true;
    else if(my<=y1 && my>=y2 && Math.abs(mx - x1)<20) // 270
        inside = true;
    return inside;
}

function insideRotationIcon(r, mx, my) {
    var inside = false;
    if(Math.abs(mx - (r.x + (r.width / 2))) <= 10 && Math.abs(my - r.y) >= 12)
        inside = true;
    else if(Math.abs(my - (r.y + (r.width / 2))) <= 5 && Math.abs(mx - r.x) >= 15)
        inside = true;
    else if(Math.abs(mx - (r.x + (r.width / 2))) <= 5 && Math.abs(my - r.y) >= 12)
        inside = true;
    else if(Math.abs(my - (r.y - (r.width / 2))) <= 5 && Math.abs(mx - r.x) >= 10)
        inside = true;
    return inside;
}

//check if mouse's pointer is inside an ellipse
function insideEllipse(r, mx, my) {
    //( x - x_c )^2 / a^2 + ( y - y_c )^2 / b^2 < 1
    var eq = (Math.pow((mx - r.x), 2) / Math.pow(r.radiusX*val_scale, 2)); // radiusX is horizontal semi-axis
    var eq2 = (Math.pow((my - r.y), 2) / Math.pow(r.radiusY*val_scale, 2)); // radiusY is vertical semi-axis
    return (eq + eq2) < 1.3;
}

//check if mouse's pointer is inside a rectangle
function insideRect(r, mx, my) {
    return (mx > r.x && mx < (r.x + (r.width*val_scale) + 10) && my > r.y && my < (r.y + (r.height*val_scale) + 10));
}

//check if mouse's pointer is inside a rhombus
function insideRhombus(r, mx, my) {
    var centerX = ((r.x + r.radius*val_scale) + (r.x - r.radius*val_scale)) / 2;
    var centerY = ((r.y) + (r.y)) / 2;
    var dx = Math.abs(mx - centerX);
    var dy = Math.abs(my - centerY);
    var d = dx / (r.width*val_scale) + dy / (r.height*val_scale);
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
    Scale(r);
    ctx.beginPath();
    ctx.moveTo(0, r.height); // Top
    ctx.lineTo(- r.width, 0); // Left
    ctx.lineTo(0,- r.height); // Bottom
    ctx.lineTo(r.width, 0); // Right
    ctx.lineTo(0, r.height); // Back to Top
    ctx.restore();
    ctx.stroke();
    border(2, "black");
}

// draw a single parallelogram
function drawParallelogram(r) {
    Scale(r);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(r.width, 0);
    var x = r.height * Math.cos(-45 * Math.PI / 180) + r.width;
    var y = r.height * Math.sin(-45 * Math.PI / 180);
    ctx.lineTo(x, y);
    x -= r.width;
    ctx.lineTo(x, y);
    ctx.closePath();
    ctx.restore();
    ctx.stroke();
    border(2, "black");
}

// draw a single triangle
function drawTriangle(r) {
    ctx.beginPath();
    ctx.moveTo(0, 5); // Top
    ctx.lineTo(-5, 0); // Left
    ctx.lineTo(0, - 5); // Bottom
    ctx.closePath();
    ctx.stroke();
    border(2, "black");
    ctx.fillStyle = "black";
    ctx.fill();
}

// draw a single line
function drawLine(r) {
    ctx.save();
    ctx.translate(r.x, r.y);
    //rotate the canvas to the specified degrees
    ctx.rotate(r.degrees * Math.PI / 180);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(r.width, 0);
    //ctx.beginPath();
    /*ctx.moveTo(r.x, r.y);
    var x = r.width * Math.cos(r.degrees * Math.PI / 180) + r.x;
    var y = r.width * Math.sin(r.degrees * Math.PI / 180) + r.y;
    ctx.lineTo(x, y);*/
    ctx.stroke();
    border(2, "black");
    if(r.id == "arrow")
        drawTriangle(r);
    ctx.restore();
}

// draw a single rectangle
function drawRect(x, y, w, h) {
    ctx.save();
    ctx.translate(x, y);
    //if(w != WIDTH && h != HEIGHT)
        ctx.scale(val_scale, val_scale);
    ctx.beginPath();
    ctx.rect(0, 0, w, h);
    ctx.restore();
    border(2, "black");
}

// draw a single ellipse
function drawEllipse(r) {
    Scale(r);
    ctx.beginPath();
    ctx.ellipse(0, 0, r.radiusY, r.radiusX, Math.PI / 2, 0, 2 * Math.PI);
    ctx.restore();
    ctx.stroke();
    border(2, "black");
}

// draw a single circle
function drawCircle(r, posx, posy) {
    ctx.beginPath();
    ctx.ellipse(/*r.x + */posx, /*r.y + */posy, 3, 3, Math.PI / 2, 0, 2 * Math.PI);
    ctx.stroke();
    border(1, "black");
    ctx.fillStyle = "blue";
    ctx.fill();
}

// draw a single rectangle of text
function drawText(r) {
    ctx.beginPath();
    ctx.rect(r.x, r.y, r.width, r.height);
    border(1, r.borderColor);
    ctx.font = "15px Comic Sans MS";
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.fillText(r.text, r.x + r.width / 2, r.y + r.height / 2);
}

// check the size of a shape (except of an ellipse) and return true if the size has been modified
function CheckSize(r, value) {
    var t = false;
    if (r.width <= value) {
        r.width++;
        t = true;
    }
    else if (r.height <= value) {
        r.height++;
        t = true;
    }
    return t;
}

// check the value resize of a rectangle or a line and resize it
function ResizeRect(r, dx, dy) {
    /*if(val_scale!=1)
        return;*/
    switch (r.resize) {
        case 0: {
            if (!CheckSize(r, 20)){ // non basta controllare solo questo (se vado veloce mi sballa tutto il rettangolo)
                r.y -= dy; 
                r.width -= dx;
            }
        } break;
        case 1: {
            if (!CheckSize(r, 20)) {
                r.x -= dx;
                r.y -= dy;
                r.width += dx;
            }
        } break;
        case 2: {
            if (r.id == "line") {
                r.degrees = (r.degrees + dy)%360;
            }
            else if (!CheckSize(r, 20)) {
                r.x -= dx;
                r.height -= dy;
            }
        } break;
        case 3: {
            if (!CheckSize(r, 20)) {
                r.x -= dx;
                r.y -= dy;
                r.height += dy;
            }
        } break;
        case 4: {
            if (!CheckSize(r, 20)) {
                r.width -= dx;
                r.height -= dy;
            }
        } break;
        case 5: {
            if (!CheckSize(r, 20)) {
                r.x -= dx;
                r.width += dx;
                r.height -= dy;
            }
        } break;
        case 6: {
            if (!CheckSize(r, 20)) {
                r.y -= dy;
                r.width -= dx;
                r.height += dy;
            }
        } break;
        case 7: {
            if (!CheckSize(r,20)) {
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
            if (!CheckSize(r,20)) // non basta controllare solo questo (se vado veloce mi sballa tutto il rombo)
                r.width += dx;
        } break;
        case 1: {
            if (!CheckSize(r,20))
                r.width -= dx;
        } break;
        case 2: {
            if (!CheckSize(r,20))
                r.height += dy;
        } break;
        case 3: {
            if (!CheckSize(r,20))
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
        case 0: {
            if (!CheckSize(r,50)) {
                r.width += dx;
                r.height += dy;
            }
        } break;
        case 1: {
            if (!CheckSize(r,50)) {
                r.x -= dx;
                r.width += dx;
                r.height += dy;
            }
        } break;
        case 2: {
            if (!CheckSize(r,50)) {
                r.x -= dx;
                r.height += dy;
            }
        } break;
        case 3: {
            if (!CheckSize(r, 50)) {
                r.y -= dy;
                r.width -= dx;
                r.height -= dy;
            }
        } break;
        case 4: {
            if (!CheckSize(r, 50)) {
                r.x -= dx;
                r.y -= dy;
                r.height -= dy;
            }
        } break;
        case 5: {
            if (!CheckSize(r, 50)) {
                r.x -= dx;
                r.y -= dy;
                r.width += dx;
            }
        } break;
        case 6: {
            if (!CheckSize(r, 50)) {
                r.x -= dx;
                r.y -= dy;
                r.width += dx;
                r.height -= dy;
            }
        } break;
        case 7: {
            if (!CheckSize(r, 50)){
                r.x -= dy;
                r.width -= dx;
            }
        } break;
    }
}

function ResizeLine(r, dx, dy) {
    switch (r.resize) {
        case 0: {
            if (!CheckSize(r, 20)){
                r.y -= dy; 
                if(r.degrees == 180)
                    r.width += dx;
                else
                    r.width -= dx;
            }
        } break;
        case 1: {
            if (!CheckSize(r, 20)) {
                r.x -= dx;
                r.y -= dy;
                if(r.degrees == 180)
                    r.width -= dx;
                else
                    r.width += dx;
            }
        } break;
        case 2: {
            if (!CheckSize(r, 20)) {
                r.x -= dx;
                if(r.degrees == 270)
                    r.width += dy;
                else
                    r.width -= dy;
            }
        } break;
        case 3: {
            if (!CheckSize(r, 20)) {
                r.x -= dx;
                r.y -= dy;
                if(r.degrees == 270)
                    r.width -= dy;
                else
                    r.width += dy;
            }
        } break;
    }
}

// check if mouse inside a shape on one of the resizing points, if yes resize the shape
function ResizeShapes(r, mx, my, dx, dy) {
    if (r.id == "rectangle" || r.id == "text") {
        if (insideRect(r, mx, my))
            ResizeRect(r, dx, dy);
    }
    else if(r.id == "line" || r.id == "arrow" ){
        if(insideLine(r, mx, my))
            ResizeLine(r, dx, dy);
    }
    else if (r.id == "rhombus"){
        if (insideRhombus(r, mx, my))
            ResizeRhombus(r, dx, dy);
    }
    else if (r.id == "ellipse"){
        if (insideEllipse(r, mx, my))
            ResizeEllipse(r, dx, dy);
    }
    else if (r.id == "parallelogram"){
        if (insideParallelogram(r, mx, my))
            ResizeParallelogram(r, dx, dy);
    }
}

// it is called by CheckResize of all shape, to set the number of resizing and change the cursor
function UtilCheckResize(r, res, type_cursor) {
    r.resize = res;
    ChangeCursor(type_cursor);
}

// check if mouse's pointer is on a resizing point
function CheckResizeRect(r, mx, my) {
    if (Math.abs(mx - r.x) < 4 && Math.abs(my - (r.y + ((r.height*val_scale) / 2))) < 4)
        UtilCheckResize(r, 0, "e-resize");
    else if (Math.abs(mx - (r.x + r.width*val_scale)) < 10 && Math.abs(my - (r.y + ((r.height*val_scale) / 2))) < 10) 
        UtilCheckResize(r, 1, "e-resize");
    else if (Math.abs(mx - (r.x + (r.width*val_scale) / 2)) < 10 && Math.abs(my - r.y) < 4)
        UtilCheckResize(r, 2, "ns-resize");
    else if (Math.abs(mx - (r.x + (r.width*val_scale) / 2)) < 10 && Math.abs(my - (r.y + r.height*val_scale)) < 10)
        UtilCheckResize(r, 3, "ns-resize");
    else if (Math.abs(mx - r.x) < 4 && Math.abs(my - r.y) < 4) 
        UtilCheckResize(r, 4, "nwse-resize");
    else if (Math.abs(mx - (r.x + r.width*val_scale)) < 4 && Math.abs(my - r.y) < 4) 
        UtilCheckResize(r, 5, "nesw-resize");
    else if (Math.abs(mx - r.x) < 4 && Math.abs(my - (r.y + r.height*val_scale)) < 4) 
        UtilCheckResize(r, 6, "nesw-resize");
    else if (Math.abs(mx - (r.x + r.width*val_scale)) < 4 && Math.abs(my - (r.y + r.height*val_scale)) < 4) 
        UtilCheckResize(r, 7, "nwse-resize");
    else
        r.resize = -1;
}

// check if mouse's pointer is on a resizing point
function CheckResizeLine(r, mx, my) {
    var x1 = r.x, y1 = r.y;
    var x2 = r.width * Math.cos(r.degrees * Math.PI / 180) + r.x;
    var y2 = r.width * Math.sin(r.degrees * Math.PI / 180) + r.y;
    /*if(mx>=x1 && mx<=x2 && Math.abs(my - y1)<5) // 0 
        inside = true;
    else if(my>=y1 && my<=y2 && Math.abs(mx - x1)<5) // 90
        inside = true;
    else if(mx<=x1 && mx>=x2 && Math.abs(my - y1)<5) // 180
        inside = true;
    else if(my<=y1 && my>=y2 && Math.abs(mx - x1)<5) // 270
        inside = true;*/
    switch(r.degrees){
        case 0 : 
        case 180: {
            if (Math.abs(mx - r.x) < 4 && Math.abs(my - r.y) < 4)
                UtilCheckResize(r, 0, "e-resize");
            else if (Math.abs(mx - x2) < 4 && Math.abs(my - r.y) < 4) 
                UtilCheckResize(r, 1, "e-resize");
            else
                r.resize = -1;
        }break;
        case 90 : 
        case 270: {
            if (Math.abs(my - y1) < 4 && Math.abs(mx - x1) < 4)
                UtilCheckResize(r, 2, "ns-resize");
            else if (Math.abs(my - y2) < 4 && Math.abs(mx - x1) <4)
                UtilCheckResize(r, 3, "ns-resize");
            else
                r.resize = -1;
        }break;
    }
}

// check if mouse's pointer is on a resizing point
function CheckResizeRhombus(r, mx, my) {
    if (Math.abs(mx - (r.x + r.width)) < 4 && Math.abs(my - r.y) < 4) 
        UtilCheckResize(r, 0, "e-resize");
    else if (Math.abs(mx - (r.x - r.width)) < 4 && Math.abs(my - r.y) < 4) 
        UtilCheckResize(r, 1, "e-resize");
    else if (Math.abs(mx - r.x) < 4 && Math.abs(my - (r.y + r.height)) < 4) 
        UtilCheckResize(r, 2, "ns-resize");
    else if (Math.abs(mx - r.x) < 4 && Math.abs(my - (r.y - r.height)) < 4) 
        UtilCheckResize(r, 3, "ns-resize");
    else
        r.resize = -1;
}

// check if mouse's pointer is on a resizing point
function CheckResizeEllipse(r, mx, my) {
    if (Math.abs(mx - r.x) < 4 && Math.abs(my - (r.y + r.radiusY)) < 4) // point down
        UtilCheckResize(r, 0, "ns-resize");
    else if (Math.abs(mx - r.x) < 4 && Math.abs(my - (r.y - r.radiusY)) < 4) // point up
        UtilCheckResize(r, 1, "ns-resize");
    else if (Math.abs(mx - (r.x + r.radiusX)) < 4 && Math.abs(my - r.y) < 4) // point dx
        UtilCheckResize(r, 2, "e-resize");
    else if (Math.abs(mx - (r.x - r.radiusX)) < 4 && Math.abs(my - r.y) < 4) // point sx
        UtilCheckResize(r, 3, "e-resize");
    else
        r.resize = -1;
}

// check if mouse's pointer is on a resizing point
function CheckResizeParallelogram(r, mx, my) {
    if (Math.abs(mx - r.x) < 10 && Math.abs(my - r.y) < 10) 
        UtilCheckResize(r, 0, "nesw-resize");
    else if (Math.abs(mx - (r.x + r.width)) < 10 && Math.abs(my - r.y) < 10)
        UtilCheckResize(r, 1, "nwse-resize");
    else if (Math.abs(mx - (r.x + r.width / 2)) < 10 && Math.abs(my - r.y) < 10)
        UtilCheckResize(r, 2, "ns-resize");
    else if (Math.abs(mx - (r.height * Math.cos(-45 * Math.PI / 180) + (r.x + r.width) - r.width)) < 10 && Math.abs(my - (r.height * Math.sin(-45 * Math.PI / 180) + r.y)) < 15) 
        UtilCheckResize(r, 3, "nwse-resize");
    else if (Math.abs(mx - (r.height * Math.cos(-45 * Math.PI / 180) + (r.x + r.width) - r.width / 2)) < 10 && Math.abs(my - (r.height * Math.sin(-45 * Math.PI / 180) + r.y)) < 16)
       UtilCheckResize(r, 4, "ns-resize");
    else if (Math.abs(mx - ((r.height / 2) * Math.cos(-45 * Math.PI / 180) + (r.x + r.width))) < 20 && Math.abs(my - ((r.height / 2) * Math.sin(-45 * Math.PI / 180) + r.y)) < 4)
        UtilCheckResize(r, 5, "e-resize");
    else if (Math.abs(mx - (r.height * Math.cos(-45 * Math.PI / 180) + (r.x + r.width))) < 10 && Math.abs(my - (r.height * Math.sin(-45 * Math.PI / 180) + r.y)) < 15)
        UtilCheckResize(r, 6, "nesw-resize");
    else if (Math.abs(mx - (r.height * Math.cos(-45 * Math.PI / 180) + (r.x + r.width) - r.width - r.height / 3)) < 10 && Math.abs(my - (r.height * Math.sin(-45 * Math.PI / 180) + r.y + r.height / 4)) < 20)
        UtilCheckResize(r, 7, "e-resize");
    else
        r.resize = -1;
}

function drawParallelogramPoints(r) {
    Scale(r);
    drawCircle(r, 0, 0);
    drawCircle(r, r.width / 2, 0);
    drawCircle(r, r.width, 0);
    drawCircle(r, -r.x + (r.height / 2) * Math.cos(-45 * Math.PI / 180) + (r.x + r.width), -r.y + (r.height / 2) * Math.sin(-45 * Math.PI / 180) + r.y);
    drawCircle(r, -r.x + r.height * Math.cos(-45 * Math.PI / 180) + (r.x + r.width), -r.y + r.height * Math.sin(-45 * Math.PI / 180) + r.y);
    drawCircle(r, -r.x + r.height * Math.cos(-45 * Math.PI / 180) + (r.x + r.width) - r.width / 2, -r.y + r.height * Math.sin(-45 * Math.PI / 180) + r.y);
    drawCircle(r, -r.x + r.height * Math.cos(-45 * Math.PI / 180) + (r.x + r.width) - r.width, -r.y + r.height * Math.sin(-45 * Math.PI / 180) + r.y);
    drawCircle(r, -r.x + r.height * Math.cos(-45 * Math.PI / 180) + (r.x + r.width) - r.width - r.height/3, -r.y + r.height * Math.sin(-45 * Math.PI / 180) + r.y + r.height/3);
    ctx.restore();
}

function drawRectPoints(r) {
    Scale(r);
    drawCircle(r, 0, r.height / 2);
    drawCircle(r, r.width, r.height / 2);
    drawCircle(r, r.width / 2, 0);
    drawCircle(r, r.width / 2, r.height);
    /*if (r.id != "text")
        drawCircle(r, r.width / 2, r.height / 2); // center*/
    drawCircle(r, 0, 0); // angle sx-up
    drawCircle(r, r.width, 0); // angle dx
    drawCircle(r, 0, r.height); // angle sx-down
    drawCircle(r, r.width, r.height); // angle dx-down
    ctx.restore();
}

// draw a rotation icon
function drawRotationIcon(r) {
    const image = document.getElementById('rotate');
    var rid = document.getElementById("myBox").scrollTop;
    ctx.save();
    ctx.translate(r.x, r.y);
    ctx.rotate(r.degrees * Math.PI / 180);
    ctx.drawImage(image, r.width / 2, -20, 10, 10);
    ctx.restore();
}

function drawLinePoints(r) {
    ctx.save();
    ctx.translate(r.x, r.y);
    ctx.rotate(r.degrees * Math.PI / 180);
    drawCircle(r, 0, 0);
    drawCircle(r, r.width, 0);
    //drawCircle(r, -r.x + r.width / 2, -r.y); // center
    ctx.restore();
}

function drawRhombusPoints(r) {
    Scale(r);
    drawCircle(r, 0, r.height);
    drawCircle(r, 0, -r.height);
    drawCircle(r, r.width, 0);
    drawCircle(r, -r.width, 0);
    ctx.restore();
    //drawCircle(r, 0, 0); // center
}

function drawEllipsePoints(r) {
    Scale(r);
    drawCircle(r, 0, r.radiusY);
    drawCircle(r, 0, -r.radiusY);
    drawCircle(r, r.radiusX, 0);
    drawCircle(r, -r.radiusX, 0);
    ctx.restore();
    //drawCircle(r, 0, 0); // center
}