var choice = false; // = true => grid, else false
var dim = 10; //indicate the dimension of the grid's squares
// variables used to handle download functionality
var save = false;
var input_file = null;

function SetMenuEvent() {
    document.getElementById("rectangle").onclick = function () { myClick("rectangle") };
    document.getElementById("line1").onclick = function () { myClick("line") };
    document.getElementById("line2").onclick = function () { myClick("arrow") };
    document.getElementById("rhombus").onclick = function () { myClick("rhombus") };
    document.getElementById("parallelogram").onclick = function () { myClick("parallelogram") };
    document.getElementById("ellipse").onclick = function () { myClick("ellipse") };
    document.getElementById("text_img").onclick = function () { myClick("text") };
    document.getElementById("reset_img").onclick = function () { reset() };
    document.getElementById("undo_img").onclick = function () { undo() };
    document.getElementById("redo_img").onclick = function () { redo() };
    document.getElementById("selection_img").onclick = function () { selection() };
    document.getElementById("download_img").onclick = function () { download() };
    document.getElementById("upload_img").onclick = function () { upload() };
    document.getElementById("rectangle").onmouseover = function () { myOver() };
    document.getElementById("line1").onmouseover = function () { myOver() };
    document.getElementById("line2").onmouseover = function () { myOver() };
    document.getElementById("rhombus").onmouseover = function () { myOver() };
    document.getElementById("parallelogram").onmouseover = function () { myOver() };
    document.getElementById("ellipse").onmouseover = function () { myOver() };
    document.getElementById("text_img").onmouseover = function () { myOver() };
    document.getElementById("reset_img").onmouseover = function () { myOver() };
    document.getElementById("undo_img").onmouseover = function () { myOver() };
    document.getElementById("redo_img").onmouseover = function () { myOver() }
    document.getElementById("selection_img").onmouseover = function () { myOver() };
    document.getElementById("download_img").onmouseover = function () { myOver() };
    document.getElementById("upload_img").onmouseover = function () { myOver() };
    document.getElementById("rectangle").onmouseout = function () { myOut() };
    document.getElementById("line1").onmouseout = function () { myOut() };
    document.getElementById("line2").onmouseout = function () { myOut() };
    document.getElementById("rhombus").onmouseout = function () { myOut() };
    document.getElementById("parallelogram").onmouseout = function () { myOut() };
    document.getElementById("ellipse").onmouseout = function () { myOut() };
    document.getElementById("text_img").onmouseout = function () { myOut() };
    document.getElementById("reset_img").onmouseout = function () { myOut() };
    document.getElementById("undo_img").onmouseout = function () { myOut() };
    document.getElementById("redo_img").onmouseout = function () { myOut() };
    document.getElementById("selection_img").onmouseout = function () { myOut() };
    document.getElementById("download_img").onmouseout = function () { myOut() };
    document.getElementById("upload_img").onmouseout = function () { myOut() };
    document.getElementById("myBox").onmouseup = function () { draw() };
    document.getElementById("myBox").onwheel = function () { draw() }; // on wheel is the event associated at the wheel's (of mouse) move
}

// handle onclick events
function myClick(t) {
    selected = t;
}

function myOver(t) {
    document.body.style.cursor = "pointer";
}

function myOut(t) {
    document.body.style.cursor = "default";
}

// handle the choice of the grid
function Choice() {
    if (grid.choice.checked)
        choice = true;
    else
        choice = false;
    draw();
}

// handle the dimension of the grid
function Quantity() {
    dim = document.getElementsByName("quantity")[0].value * 10;
    if (choice)
        draw();
}

// reset the canvas
function reset() {
    for (var i = 0; i < nodes.length; i++){
        var r = nodes[i];
        if(r.id != "selection")
            r.trasparence = 1.0;
    }
    nodes.splice(0, nodes.length); // remove all element of nodes
    InsertCopy([]); // insert in copy an empty array
    selectionok = selectionMode = false;
    draw();
}

// handle the upload functionality
function upload(){
    // delete input text for insert name file if it exists
    if(input_file!=null){
        document.getElementById("input_file").removeChild(input_file);
        save = true;
    }
    var input = document.createElement('input');
    input.type = "file";
    input.accept = ".json";
    var element = document.getElementById('input_div').appendChild(input);
    element.style.display = 'none';
    element.click();
    input.addEventListener('change', function() {
        var fr = new FileReader();
        fr.onload = function() {
            nodes.splice(0,nodes.length);
            copy.splice(0,copy.length);
            var json = JSON.parse(this.result);
            for(var i=0;i<json.length;i++)
                nodes.push(json[i]);
            selected = null;
            pointer = -1;
            InsertCopy([]); // add an empty array to the start of array copy
            NodesToCopy(); // copy all elements of nodes into array copy
            draw();
        }
        fr.readAsText(this.files[0]);
        document.body.removeChild(element);
      });
}

// handle the download functionality
function download() {
    if(!save){
        input_file = document.createElement("input");
        input_file.setAttribute('type', 'text');
        input_file.setAttribute('name', 'text_file');
        document.getElementById("input_file").appendChild(input_file);
        save = true;
    }
    else{
        var filename = document.getElementsByName("text_file")[0].value;
        filename += ".json";
        document.getElementById("input_file").removeChild(input_file);
        input_file = null;
        save = false;
        if(!nodes.length)
            return;
        var data = JSON.stringify(nodes); // Serializzazione
        var element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(data));
        element.setAttribute('download', filename);
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    }
}