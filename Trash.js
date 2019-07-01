var trashX = 1065, trashY = 467, trashW = 30, trashH = 30; //size and position of trash used to delete element on canvas
var trashY_actual, trashX_actual, degrees = 0; // used to manage the drawing of trash

function aroundTrash(mx, my) {
    if (Math.abs(mx - trashX_actual) < 100 && Math.abs(my - trashY_actual) < 100) {
        degrees = 90;
        draw();
        setTimeout(function () {
            degrees = 0;
            draw();
        }, 2000);
    }
}

function RemoveShape(i){
    var tmp = JSON.parse(JSON.stringify(nodes));
    // save it in copy with the initial position x e y and then delete it
    var r = tmp[i];
    r.x =  r.initX;
    r.y = r.initY;
    r.isDragging = false;
    r.isSelected = false;
    r.trasparence = 1.0;
    copy.push(tmp);
    nodes.splice(i, 1);
}

function insideTrash(mx, my, i) {
    if (mx > trashX_actual && mx < trashX_actual + trashW && my > trashY_actual && my < trashY_actual + trashH) {
        if(selectionMode){
            for(var i = 0; i < nodes.length; i++){
                var r = nodes[i];
                if(insideRectSelection(r.x,r.y) && r.id != "selection" && !selectionok && r.isSelected)
                    RemoveShape(i);
            }
        }
        else
            RemoveShape(i);
        ChangeCursor("default");
    }
}

//draw trash
function drawTrash() {
    const trash_lower = document.getElementById('trash_down');
    const trash_above = document.getElementById('trash_up');
    var scrolly = parseInt(document.getElementById("myBox").scrollTop);
    var scrollx = parseInt(document.getElementById("myBox").scrollLeft);
    trashY_actual = trashY + scrolly;
    trashX_actual = trashX + scrollx;
    ctx.globalAlpha = 1.0;
    ctx.save();
    // move to the center of the trash image
    ctx.translate(trashW / 2, trashH / 2);
    // rotate the canvas to the specified degrees
    ctx.rotate(degrees*Math.PI / 180);
    // draw the above part of trash
    if (degrees == 90)
        ctx.drawImage(trash_above, 431 + scrolly, -(trashY * 2 + 145 + scrollx), 20, 10);
    else
        ctx.drawImage(trash_above, trashX - 15 + scrollx, trashY - 25 + scrolly, 20, 10);
    ctx.restore();
    // draw the lower part of trash
    ctx.drawImage(trash_lower, trashX + scrollx, trashY + scrolly, 20,20);
}