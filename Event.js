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

    /***********************************/
    mousedown = true;
    clickedArea = findCurrentArea(e.offsetX, e.offsetY);
    x1 = e.offsetX;
    y1 = e.offsetY;
    x2 = e.offsetX;
    y2 = e.offsetY;
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
    /*****************/
    if (clickedArea.box == -1 && tmpBox != null) {
        boxes.push(tmpBox);
    } else if (clickedArea.box != -1) {
        var selectedBox = boxes[clickedArea.box];
        if (selectedBox.x1 > selectedBox.x2) {
            var previousX1 = selectedBox.x1;
            selectedBox.x1 = selectedBox.x2;
            selectedBox.x2 = previousX1;
        }
        if (selectedBox.y1 > selectedBox.y2) {
            var previousY1 = selectedBox.y1;
            selectedBox.y1 = selectedBox.y2;
            selectedBox.y2 = previousY1;
        }
    }
    clickedArea = { box: -1, pos: 'o' };
    tmpBox = null;
    mousedown = false;
    console.log(boxes);
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
                drawCircle(r, 0, 0);
                drawCircle(r, r.width, 0);
                drawCircle(r, r.height + 60, -50);
                drawCircle(r, r.height + 60 - r.width, -50);
                WriteCoordinates(mx, my);
                ChangeCursor("move", r.id);
                return;
            }
        }
        else if (r.id == "rectangle") {
            if (insideRect(r, mx, my)) {
                drawCircle(r, 0, r.height / 2);
                drawCircle(r, r.width, r.height / 2);
                drawCircle(r, r.width / 2, 0);
                drawCircle(r, r.width / 2, r.height);
                WriteCoordinates(mx, my);
                ChangeCursor("move", r.id);
                /*if (mx == r.x && my == (r.y + (r.height / 2)))
                    document.write("first point");*/
                return;
            }
        }
        else if (r.id == "line") {
            if (insideLine(r, mx, my)) {
                drawCircle(r, 0, 0);
                drawCircle(r, r.width, 0);
                WriteCoordinates(mx, my);
                ChangeCursor("move", r.id);
                return;
            }
        }
        else if (r.id == "rhombus") {
            if (insideRhombus(r, mx, my)) {
                drawCircle(r, 0, r.height);
                drawCircle(r, 0, -r.height);
                drawCircle(r, r.width, 0);
                drawCircle(r, -r.width, 0);
                WriteCoordinates(mx, my);
                ChangeCursor("move", r.id);
                return;
            }
        }
        else if (r.id == "ellipse") {
            if (insideEllipse(r, mx, my)) {
                drawCircle(r, 0, r.radiusY);
                drawCircle(r, 0, -r.radiusY);
                drawCircle(r, r.radiusX, 0);
                drawCircle(r, -r.radiusX, 0);
                WriteCoordinates(mx, my);
                ChangeCursor("move", r.id);
                return;
            }
        }
        ChangeCursor("default", "");
        draw(); //redraw in order that i delete the points on the border of polygon
    }
    WriteCoordinates(mx, my);

    /**********************/
    if (mousedown && clickedArea.box == -1) {
        x2 = e.offsetX;
        y2 = e.offsetY;
        draw();
    } else if (mousedown && clickedArea.box != -1) {
        x2 = e.offsetX;
        y2 = e.offsetY;
        xOffset = x2 - x1;
        yOffset = y2 - y1;
        x1 = x2;
        y1 = y2;

        if (clickedArea.pos == 'i' ||
            clickedArea.pos == 'tl' ||
            clickedArea.pos == 'l' ||
            clickedArea.pos == 'bl') {
            boxes[clickedArea.box].x1 += xOffset;
        }
        if (clickedArea.pos == 'i' ||
            clickedArea.pos == 'tl' ||
            clickedArea.pos == 't' ||
            clickedArea.pos == 'tr') {
            boxes[clickedArea.box].y1 += yOffset;
        }
        if (clickedArea.pos == 'i' ||
            clickedArea.pos == 'tr' ||
            clickedArea.pos == 'r' ||
            clickedArea.pos == 'br') {
            boxes[clickedArea.box].x2 += xOffset;
        }
        if (clickedArea.pos == 'i' ||
            clickedArea.pos == 'bl' ||
            clickedArea.pos == 'b' ||
            clickedArea.pos == 'br') {
            boxes[clickedArea.box].y2 += yOffset;
        }
        draw();
    }
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

function MyOut(e) {
    if (clickedArea.box != -1) {
        var selectedBox = boxes[clickedArea.box];
        if (selectedBox.x1 > selectedBox.x2) {
            var previousX1 = selectedBox.x1;
            selectedBox.x1 = selectedBox.x2;
            selectedBox.x2 > previousX1;
        }
        if (selectedBox.y1 > selectedBox.y2) {
            var previousY1 = selectedBox.y1;
            selectedBox.y1 = selectedBox.y2;
            selectedBox.y2 > previousY1;
        }
    }
    mousedown = false;
    clickedArea = { box: -1, pos: 'o' };
    tmpBox = null;
}