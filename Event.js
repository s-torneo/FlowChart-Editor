
var mx, my; // indicate the coordinates of mouse
var input, input_ok = false; // used to manage the input text mode

function myDoubleClick(e) {
    // tell the browser we're handling this mouse event
    e.preventDefault();
    e.stopPropagation();
    // get the current mouse position
    mx = parseInt(e.clientX - offsetX);
    my = parseInt(e.clientY - offsetY) + parseInt(document.getElementById("myBox").scrollTop);
    //new shape if you press on a shape twice
    for (var i = 0; i < nodes.length; i++) {
        var r = nodes[i];
        if (r.id == "rectangle") {
            if (insideRect(r, mx, my))
                newRect(mx + 50, my);
        }
        else if (r.id == "line" || r.id == "arrow") {
            if (insideLine(r, mx, my))
                newLine(mx + 50, my, r.id);
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
            if (insideRect(r, mx, my) && !input_ok) {
                input = document.createElement("input");
                input.setAttribute('type', 'text');
                input.setAttribute('name', 'text_input');
                document.getElementById("text").appendChild(input);
                r.input = true;
                input_ok = true;
            }
        }
        draw();
    }
}

function DragOk(r) {
    dragok = true;
    r.isDragging = true;
    ChangeCursor("move");
    r.initX = r.x;
    r.initY = r.y;
    if(r.id != "selection")
        RemoveSelection();
}

// handle mousedown events
function myDown(e) {
    // tell the browser we're handling this mouse event
    e.preventDefault();
    e.stopPropagation();
    // get the current mouse position
    mx = parseInt(e.clientX - offsetX);
    my = parseInt(e.clientY - offsetY) + parseInt(document.getElementById("myBox").scrollTop);
    // test each rect to see if mouse is inside
    dragok = false;
    ManagerSelection();
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
        else if (r.id == "selection"){
            if(insideRectSelection(mx,my))
                DragOk(r);
        }
        else if (r.id == "line" || r.id == "arrow") {
            if (insideLine(r, mx, my)) {
                DragOk(r);
                CheckResizeLine(r, mx, my);
                if (insideRotationIcon(r, mx, my)) {
                    r.degrees = (r.degrees + 90)%360;
                    drawLinePoints(r);
                    draw();
                }
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
    // reset resizing mode for all shape
    for (var i = 0; i < nodes.length; i++)
        nodes[i].resize = -1;
    // save the current mouse position
    startX = mx;
    startY = my;
}


// handle mouseup events
function myUp(e) {
    // tell the browser we're handling this mouse event
    e.preventDefault();
    e.stopPropagation();
    mx = parseInt(e.clientX - offsetX);
    my = parseInt(e.clientY - offsetY) + parseInt(document.getElementById("myBox").scrollTop);
    //check if i have selected an object from menu
    if (selected != null) {
        if (selected == "rectangle")
            newRect(mx, my);
        else if (selected == "line" || selected == "arrow")
            newLine(mx, my, selected);
        else if (selected == "rhombus")
            newRhombus(mx, my);
        else if (selected == "parallelogram")
            newParallelogram(mx, my);
        else if (selected == "ellipse")
            newEllipse(mx, my);
        else if (selected == "text")
            newText(mx, my);
        selected = null;
        selectionMode = false;
        selectionok = false;
        draw();
        return;
    }
    // clear all the dragging flags
    dragok = false;
    for (var i = 0; i < nodes.length; i++)
        nodes[i].isDragging = dragok;
    ChangeCursor("default");
}

// handle mouse moves
function myMove(e) {
    // tell the browser we're handling this mouse event
    e.preventDefault();
    e.stopPropagation();
    // get the current mouse position
    mx = parseInt(e.clientX - offsetX);
    my = parseInt(e.clientY - offsetY) + parseInt(document.getElementById("myBox").scrollTop);
    var dx = mx - startX;
    var dy = my - startY;
    // if we're dragging anything...
    if (dragok || selectionok) {
        // calculate the distance the mouse has moved
        // since the last mousemove
        if(selectionok)
            drawSelection(dx, dy);
        // move each rect that isDragging
        // by the distance the mouse has moved
        // since the last mousemove
        for (var i = 0; i < nodes.length; i++) {
            var r = nodes[i];
            if(insideRectSelection(r.x,r.y) && r.id != "selection" && !selectionok && r.isSelected){
                r.x += dx;
                r.y += dy;
            }
            else if (r.isDragging) {
                r.x += dx;
                r.y += dy;
                // check if the shape is a text's rectangle and if mouse is inside it
                if (r.id == "text" && r.input && insideRect(r, mx, my)) {
                    // if yes, get value from input text and delete it
                    r.text = document.getElementsByName("text_input")[0].value;
                    document.getElementById("text").removeChild(input);
                    r.input = false;
                    input_ok = false; 
                }
                // check if a shape can be resized
                if (r.resize >= 0){
                    res = true;
                    ResizeShapes(r, mx, my, dx, dy);
                }
                // check if a polygon is inside or around the "trash"
                aroundTrash(mx,my);
                insideTrash(mx, my, i);
            }
        }
        // redraw the scene with the new rect positions
        draw();
        // reset the starting mouse position for the next mousemove
        startX = mx;
        startY = my;
    }
    // check the number of shape inside selection's rectangle and if the number is 0 => delete it
    ShapeInsideSelection(1);
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
                return;
            }
        }
        else if (r.id == "selection"){
            if(insideRectSelection(mx,my)){
                WriteCoordinates(mx, my);
                ChangeCursor("move");
                return;
            }
        }
        else if (r.id == "line" || r.id == "arrow") {
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
    var text = mx + ", " + my;
    document.getElementById("coordinates").innerHTML = text;
}

// change the mouse's icon
function ChangeCursor(val) {
    document.body.style.cursor = val;
}