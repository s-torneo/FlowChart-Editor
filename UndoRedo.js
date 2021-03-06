var pointer = -1; // pointer to current position of array copy

function MakeUR(){
    var tmp = JSON.parse(JSON.stringify(copy[pointer]));
    nodes.splice(0,nodes.length);
    nodes = JSON.parse(JSON.stringify(tmp));
    for (var i = 0; i<nodes.length; i++)
      nodes[i].trasparence = 1.0;
    RemoveSelection();
    selectionMode = false;
    draw();
}

function undo() {
    if (pointer <= 0)
        return;
    pointer--;
    MakeUR();
}

function redo() {
    if(pointer == copy.length-1)
        return;
    pointer++;
    MakeUR();
}

// insert in copy an element passed like argument
function InsertCopy(element){
    copy.push(element);
    pointer++;
}

// copy the array nodes into array copy
function NodesToCopy(){
    if(pointer!=copy.length-1) // in the case in which pointer is not at the end of copy
        copy.splice(pointer+1,copy.length-pointer-1);
    var tmp = JSON.parse(JSON.stringify(nodes));
    InsertCopy(tmp);
}

function ManagerUR(){
    var old_v = JSON.parse(JSON.stringify(nodes)); // old version
    var new_v = JSON.parse(JSON.stringify(nodes)); // new version
    var flag = false;
    for(var i=0; i<new_v.length; i++){
        if(new_v[i].last){
            old_v[i].x = nodes[i].initX;
            old_v[i].y = nodes[i].initY;
            old_v[i].last = new_v[i].last = 0;
            flag = true;
        }
        else if(new_v[i].rotate || new_v[i].resize>=0)
            flag = true;
    }
    if(pointer!=copy.length-1){ // in the case in which pointer is not at the end of copy and a shape has been moved
        copy.splice(pointer+1,copy.length-pointer-1); // delete the following positions of pointer
        InsertCopy(new_v); // push to copy the new version of nodes
        nodes.splice(0,nodes.length);
        nodes = JSON.parse(JSON.stringify(new_v)); // copy the new version of nodes in nodes 
    }   
    else if(flag) // in the case in which a shape is moved, resized or rotated
        InsertCopy(new_v);
}