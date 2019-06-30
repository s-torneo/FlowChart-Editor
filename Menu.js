function Menu() {
    document.getElementById("rect_img").onclick = function () { myClick("rectangle") };
    document.getElementById("line_img").onclick = function () { myClick("line") };
    document.getElementById("arrow_img").onclick = function () { myClick("arrow") };
    document.getElementById("rhombus_img").onclick = function () { myClick("rhombus") };
    document.getElementById("parallelogram_img").onclick = function () { myClick("parallelogram") };
    document.getElementById("ellipse_img").onclick = function () { myClick("ellipse") };
    document.getElementById("text_img").onclick = function () { myClick("text") };
    document.getElementById("reset_img").onclick = function () { reset() };
    document.getElementById("undo_img").onclick = function () {if (!flag) undo(); else { redo(); flag = true; } };
    document.getElementById("redo_img").onclick = function () {if (!flag) redo(); else { undo(); flag = true; } };
    document.getElementById("selection_img").onclick = function () { selection() };
    document.getElementById("download_img").onclick = function () { download() };
    document.getElementById("upload_img").onclick = function () { upload() };
    document.getElementById("rect_img").onmouseover = function () { myOver() };
    document.getElementById("line_img").onmouseover = function () { myOver() };
    document.getElementById("arrow_img").onmouseover = function () { myOver() };
    document.getElementById("rhombus_img").onmouseover = function () { myOver() };
    document.getElementById("parallelogram_img").onmouseover = function () { myOver() };
    document.getElementById("ellipse_img").onmouseover = function () { myOver() };
    document.getElementById("text_img").onmouseover = function () { myOver() };
    document.getElementById("reset_img").onmouseover = function () { myOver() };
    document.getElementById("undo_img").onmouseover = function () { myOver() };
    document.getElementById("redo_img").onmouseover = function () { myOver() }
    document.getElementById("selection_img").onmouseover = function () { myOver() };
    document.getElementById("download_img").onmouseover = function () { myOver() };
    document.getElementById("upload_img").onmouseover = function () { myOver() };
    document.getElementById("rect_img").onmouseout = function () { myOut() };
    document.getElementById("line_img").onmouseout = function () { myOut() };
    document.getElementById("arrow_img").onmouseout = function () { myOut() };
    document.getElementById("rhombus_img").onmouseout = function () { myOut() };
    document.getElementById("parallelogram_img").onmouseout = function () { myOut() };
    document.getElementById("ellipse_img").onmouseout = function () { myOut() };
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

function Choice() {
    if (grid.choice.checked)
        choice = true;
    else
        choice = false;
    draw();
}

function Quantity() {
    dim = document.getElementsByName("quantity")[0].value * 10;
    if (choice)
        draw();
}

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
            draw();
        }
        fr.readAsText(this.files[0]);
        document.body.removeChild(element);
      });
}
    
var save = false;
var input_file = null;

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