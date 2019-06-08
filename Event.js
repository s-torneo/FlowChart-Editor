//var input = null, inputr = null;
function myDoubleClick(e) {
    // tell the browser we're handling this mouse event
    e.preventDefault();
    e.stopPropagation();
    // get the current mouse position
    var mx = parseInt(e.clientX - offsetX);
    var my = parseInt(e.clientY - offsetY) + document.getElementById("myBox").scrollTop;
    //new object if i have press central key of mouse
    for (var i = 0; i < nodes.length; i++) {
        var r = nodes[i];
        if (r.id == "rectangle") {
            if (insideRect(r, mx, my))
                newRect(mx + 50, my);
            //inputr = r;
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
        else if (r.id == "text") {
            if (insideRect(r, mx, my)) {
                input = document.createElement("input");
                input.setAttribute('type', 'text');
                input.setAttribute('name', 'text_input');
                document.getElementById("text").appendChild(input);
                r.input = true;
            }
        }
        draw();
    }
}

var initX, initY;

function DragOk(r) {
    // if yes, set that rects isDragging=true
    dragok = true;
    r.isDragging = true;
    ChangeCursor("move");
    initX = r.x;
    initY = r.y;
}

// handle mousedown events
function myDown(e) {
    // tell the browser we're handling this mouse event
    e.preventDefault();
    e.stopPropagation();
    // get the current mouse position
    var mx = parseInt(e.clientX - offsetX);
    var my = parseInt(e.clientY - offsetY) + document.getElementById("myBox").scrollTop;
    // test each rect to see if mouse is inside
    dragok = false;
    for (var i = 0; i < nodes.length; i++) {
        var r = nodes[i];
        if (r.id == "parallelogram") {
            if (insideParallelogram(r, mx, my)) {
                DragOk(r);
                CheckResizeParallelogram(r, mx, my);
            }
        }
        else if (r.id == "rectangle" || r.id == "text") {
            if (insideRect(r, mx, my)) {
                DragOk(r);
                CheckResizeRect(r, mx, my);
            }
        }
        else if (r.id == "line") {
            if (insideLine(r, mx, my)) {
                DragOk(r);
                CheckResizeLine(r, mx, my);
                if (insideRotationIcon(r, mx, my))
                    rotateLine(r);
            }
        }
        else if (r.id == "rhombus") {
            if (insideRhombus(r, mx, my)) {
                DragOk(r);
                CheckResizeRhombus(r, mx, my);
            }
        }
        else if (r.id == "ellipse") {
            if (insideEllipse(r, mx, my)) {
                DragOk(r);
                CheckResizeEllipse(r, mx, my);
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
        else if (selected == "text")
            newText(mx, my);
        selected = null;
        draw();
        return;
    }
    // clear all the dragging flags
    dragok = false;
    for (var i = 0; i < nodes.length; i++) {
        nodes[i].isDragging = false;
    }
    ChangeCursor("default");
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
                if (r.id == "text" && r.input && insideRect(r, mx, my)) {
                    r.text = document.getElementsByName("text_input")[0].value;
                    document.getElementById("text").removeChild(input);
                    r.input = false;
                }
                if (r.resize >= 0)
                    ResizeShapes(r, mx, my, dx, dy);
                // check if a polygon is inside the "trash"
                if (mx > trashX && mx < trashX + trashW && my > trashY_act && my < trashY_act + trashH) {
                    // if yes, save it in copy with the initial position x e y and then delete it
                    nodes[i].x = initX;
                    nodes[i].y = initY;
                    nodes[i].isDragging = false;
                    copy.push(nodes[i]);
                    removed = true;
                    nodes.splice(i, 1);
                    ChangeCursor("default");
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
                drawParallelogramPoints(r);
                WriteCoordinates(mx, my);
                ChangeCursor("move");
                CheckResizeParallelogram(r, mx, my);
                return;
            }
        }
        else if (r.id == "rectangle" || r.id == "text") {
            if (insideRect(r, mx, my)) {
                if (r.id == "text")
                    r.borderColor = "green";
                drawRectPoints(r);
                WriteCoordinates(mx, my);
                ChangeCursor("move");
                CheckResizeRect(r, mx, my);
                return;
            }
            else if (r.id == "text") {
                r.borderColor = "white";
            }
        }
        else if (r.id == "line") {
            if (insideLine(r, mx, my)) {
                drawRotationIcon(r);
                drawLinePoints(r);
                WriteCoordinates(mx, my);
                ChangeCursor("move");
                CheckResizeLine(r, mx, my);
                return;
            }
        }
        else if (r.id == "rhombus") {
            if (insideRhombus(r, mx, my)) {
                drawRhombusPoints(r);
                WriteCoordinates(mx, my);
                ChangeCursor("move");
                CheckResizeRhombus(r, mx, my);
                return;
            }
        }
        else if (r.id == "ellipse") {
            if (insideEllipse(r, mx, my)) {
                drawEllipsePoints(r);
                WriteCoordinates(mx, my);
                ChangeCursor("move");
                CheckResizeEllipse(r, mx, my);
                return;
            }
        }
        ChangeCursor("default", "");
        draw(); //redraw in order that i delete the points on the border of polygon
    }
    WriteCoordinates(mx, my);
}

// show coordinates of mouse
function WriteCoordinates(mx, my) {
    var text = mx + "," + my;
    document.getElementById("coordinates").innerHTML = text;
}

// change the mouse's icon
function ChangeCursor(val) {
    document.body.style.cursor = val;
}