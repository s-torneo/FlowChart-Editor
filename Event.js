var mx, my; // indicate the coordinates of mouse
var dragok, startX, startY; // drag related variables
var input, input_ok = false; // used to manage the input text mode

var saved_mx, saved_my, saved = null; /* used to manage the case in which a text's rectangle is inside a shape and
                                          it is double-clicked to write something */

// save coordinates to create a new shape later
function Save(r, mx, my){
    saved_mx = mx;
    saved_my = my;
    saved = r;
}

function NewShape() {
    if(saved.id == "rectangle")
        newRect(saved_mx + saved.width, saved_my);
    else if (saved.id == "line" || saved.id == "arrow")
        newLine(saved_mx + saved.width, saved_my, saved.id);
    else if (saved.id == "parallelogram") 
        newParallelogram(saved_mx + saved.width, saved_my);
    else if (saved.id == "ellipse") 
        newEllipse(saved_mx + saved.radiusX*2, saved_my);
    else if (saved.id == "rhombus") 
        newRhombus(saved_mx + saved.width*2, saved_my);
    // delete elements created by double-click effect
    copy.splice(pointer,copy.length-pointer-1); 
}

function myDoubleClick(e) {
    // tell the browser we're handling this mouse event
    e.preventDefault();
    e.stopPropagation();
    SetCoordinates();
    // get the current mouse position
    mx = parseInt(e.clientX - offsetX);
    my = parseInt(e.clientY - offsetY);
    //new shape if you press on a shape twice
    for (var i = 0; i < nodes.length; i++) {
        var r = nodes[i];
        if (r.id == "text" && insideRect(r, mx, my) && !input_ok) {
            input = document.createElement("input");
            input.setAttribute('type', 'text');
            input.setAttribute('name', 'text_input');
            input.setAttribute('class', 'funct');
            if(r.text!="Text")
              input.setAttribute('value', r.text);
            input.setAttribute('placeholder', 'Click on text rect to confirm');
            input.setAttribute('autofocus','true');
            input.style.fontSize = "63%";
            input.style.width = "90%";
            var text = document.getElementById("insert_text");
            text.style.display = "none";
            document.getElementById("text_img").appendChild(input);
            r.input = true;
            input_ok = true;
            // put element on head
            nodes.splice(i,1);
            nodes.unshift(r);
            ManagerUR(); // to save the changing of text in copy
        }
        else if (insideRect(r, mx, my))
            Save(r, mx, my);
        else if (insideLine(r, mx, my))
            Save(r, mx, my);
        else if (insideParallelogram(r, mx, my))
            Save(r, mx, my);
        else if (insideEllipse(r, mx, my))
            Save(r, mx, my);
        else if (insideRhombus(r, mx, my))
            Save(r, mx, my);
    }
    // if a rectangle was double-clicked i make a new rectangle, using coordinates saved previously
    if(!input_ok && saved!=null){
        NewShape();
        saved = null;
    }
    draw();
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
    SetCoordinates();
    // get the current mouse position
    mx = parseInt(e.clientX - offsetX);
    my = parseInt(e.clientY - offsetY);
    // test each rect to see if mouse is inside
    dragok = false;
    ManagerSelection();
    for (var i = 0; i<nodes.length; i++) {
        var r = nodes[i];
        if (r.id == "parallelogram") {
            if (insideParallelogram(r, mx, my)) {
                DragOk(r);
                CheckResizeParallelogram(r, mx, my);
                break;
            }
        }
        else if (r.id == "rectangle" || r.id == "text") {
            if (insideRect(r, mx, my)) {
                // check if the shape is a text's rectangle
                if (r.id == "text" && r.input) {
                    // if yes, get value from input text and delete it
                    var tmp_text = document.getElementsByName("text_input")[0].value;
                    // check if value has a length > 0
                    if (tmp_text.length)
                        r.text = tmp_text; 
                    RemoveInputText();
                    r.input = false;
                    ManagerUR(); // to save the changing of text
                    draw();
                    break;
                }
                else{
                    DragOk(r);
                    CheckResizeRect(r, mx, my);
                }
                break;
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
                break;
            }
        }
        else if (r.id == "rhombus") {
            if (insideRhombus(r, mx, my)) {
                DragOk(r);
                CheckResizeRhombus(r, mx, my);
                break;
            }
        }
        else if (r.id == "ellipse") {
            if (insideEllipse(r, mx, my)) {
                DragOk(r);
                CheckResizeEllipse(r, mx, my);
                break;
            }
        }
    }
    // reset flag resize for all shapes
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
    SetCoordinates();
    mx = parseInt(e.clientX - offsetX);
    my = parseInt(e.clientY - offsetY);
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
    ChangeCursor("default");
    dragok = false;
    var bl = false;
    for (var i = 0; i < nodes.length; i++){
        var r = nodes[i];
        if(r.isDragging) {
            r.isDragging = dragok; // clear all the dragging flags
            // put element on head
            nodes.splice(i,1);
            nodes.unshift(r);
            if(r.x != r.initX && r.y != r.initY){
                r.last = 1;
                bl = true;
            }
        }
        if(r.rotate) // if a line or an arrow was rotated
            bl = true;
        if(r.resize>=0) // if a shape was resized
            bl = true;
    }
    if(bl)
        ManagerUR();
    // reset the flag rotate for all shape of type "line" or "arrow"
    for (var i = 0; i < nodes.length; i++)
        if(nodes[i].id == "line" || nodes[i].id == "arrow")
            nodes[i].rotate = 0;
}

// handle mouse moves
function myMove(e) {
    // tell the browser we're handling this mouse event
    e.preventDefault();
    e.stopPropagation();
    SetCoordinates();
    // get the current mouse position
    mx = parseInt(e.clientX - offsetX);
    my = parseInt(e.clientY - offsetY);
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
            if(insideRectSelection(r.x,r.y) && r.id != "selection" && !selectionok && r.isSelected) {
                r.x += dx;
                r.y += dy;
            }
            else if (r.isDragging) {
                r.x += dx;
                r.y += dy;
                // check if a shape can be resized
                if (r.resize >= 0)
                    ResizeShapes(r, mx, my, dx, dy);
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
    for (var i = 0, inside = false; i < nodes.length; i++) {
        var r = nodes[i];
        if (r.id == "parallelogram") {
            if (insideParallelogram(r, mx, my)) {
                drawParallelogramPoints(r);
                ChangeCursor("move");
                CheckResizeParallelogram(r, mx, my);
                break;
            }
        }
        else if (r.id == "rectangle" || r.id == "text") {
            if (insideRect(r, mx, my)) {
                if (r.id == "text")
                    r.borderColor = "green";
                drawRectPoints(r);
                ChangeCursor("move");
                CheckResizeRect(r, mx, my);
                break;
            }
            else if (r.id == "text")
                r.borderColor = "white";
        }
        else if (r.id == "selection"){
            if(insideRectSelection(mx,my)){
                ChangeCursor("move");
                break;
            }
        }
        else if (r.id == "line" || r.id == "arrow") {
            if (insideLine(r, mx, my)) {
                drawRotationIcon(r);
                drawLinePoints(r);
                ChangeCursor("move");
                CheckResizeLine(r, mx, my);
                break;
            }
        }
        else if (r.id == "rhombus") {
            if (insideRhombus(r, mx, my)) {
                drawRhombusPoints(r);
                ChangeCursor("move");
                CheckResizeRhombus(r, mx, my);
                break;
            }
        }
        else if (r.id == "ellipse") {
            if (insideEllipse(r, mx, my)) {
                drawEllipsePoints(r);
                ChangeCursor("move");
                CheckResizeEllipse(r, mx, my);
                break;
            }
        }
        ChangeCursor("default");
        draw(); //redraw in order that i delete the points on the border of polygon
    }
}

// return coordinates of mouse
function GetCoordinates() {
    var coordinates = (mx == null) ? "" : (mx + ", " + my);
    return coordinates;
}

// change the mouse's icon
function ChangeCursor(val) {
    document.body.style.cursor = val;
}