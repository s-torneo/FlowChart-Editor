var selectionMode = false, selectionok = false; // boolean that indicates if the selection mode is active
var sel_x, sel_y; // initial coordinates of selection's rectangle
var sel_w, sel_h; // width and height of selection's rectangle

function newSelection(px,py,w,h){
    nodes.push({ x: px, y: py, width: w, height: h, isDragging: false, id: "selection" });
}

function ShapeInsideSelection(flag){
    // flag is used to know if ShapeInsideSelection is called from ManagerSelection or myMove
    var shape = 0;
    for (var i = 0; i < nodes.length; i++) {
        var r = nodes[i];
        if(insideRectSelection(r.x,r.y) && r.id != "selection"){
            shape++;
            if(!flag){
                r.initX = r.x;
                r.initY = r.y;
                r.isSelected = true;
                r.trasparence = 0.2;
                //r.isDragging = false;
            }
        }
    }
    if(!shape)
        RemoveSelection();
    return shape;
}

function insideRectSelection(x, y){
    var inside = false;
    if(x > sel_x && x < (sel_x + sel_w) && y > sel_y && y < (sel_y + sel_h))
        inside = true;
    else if(x < sel_x && x > (sel_x + sel_w) && y < sel_y && y > (sel_y + sel_h))
        inside = true;
    else if(x < sel_x && x > (sel_x + sel_w) && y > sel_y && y < (sel_y + sel_h))
        inside = true;
    else if(x > sel_x && x < (sel_x + sel_w) && y < sel_y && y > (sel_y + sel_h))
        inside = true;
    return inside;
}

function drawSelection(dx,dy){
    sel_w+=dx;
    sel_h+=dy;
    drawRect(null, 2);
    border(2, "red");
}

function moveSelection(r){
    sel_x = r.x;
    sel_y = r.y;
    drawRect(null, 2);
    border(2, "red");
}

function RemoveSelection(){
    for(var i = 0; i < nodes.length; i++){
        var r = nodes[i];
        if(r.id == "selection"){
            nodes.splice(i,1);
            selectionok = false;
        }
        r.isSelected = false;
        r.trasparence = 1.0;
    }
    draw();
}

function selection(){
    if(!selectionMode) 
        selectionMode = true;
    else {
        selectionMode = false;
        RemoveSelection();
    }
}

function ManagerSelection(){
    if(selectionMode){
        if(selectionok){
            selectionok = false;
            // check the number of shape inside selection's rectangle and if the number is 0 => delete it
            if(ShapeInsideSelection(0))
                newSelection(sel_x,sel_y,sel_w,sel_h);
            selected = null;
        }
        else if(!insideRectSelection(mx,my)){
            selectionok = true;
            sel_x = mx;
            sel_y = my;
            sel_h = sel_w = 0;
            for(var i = 0; i < nodes.length; i++){
                if(nodes[i].id == "selection"){
                    nodes[i].x = sel_x;
                    nodes[i].y = sel_y;
                }
                nodes[i].trasparence = 1.0;
            }
            draw();
        }
    }
}
