function Menu() {
    document.getElementById("rect_img").onclick = function () { myClick("rectangle") };
    document.getElementById("line_img").onclick = function () { myClick("line") };
    document.getElementById("rhombus_img").onclick = function () { myClick("rhombus") };
    document.getElementById("parallelogram_img").onclick = function () { myClick("parallelogram") };
    document.getElementById("ellipse_img").onclick = function () { myClick("ellipse") };
    document.getElementById("text_img").onclick = function () { myClick("text") };
    document.getElementById("reset_img").onclick = function () { reset() };
    document.getElementById("undo_img").onclick = function () {if (!flag) undo(); else { redo(); flag = true; } };
    document.getElementById("redo_img").onclick = function () {if (!flag) redo(); else { undo(); flag = true; } };
    document.getElementById("rect_img").onmouseover = function () { myOver() };
    document.getElementById("line_img").onmouseover = function () { myOver() };
    document.getElementById("rhombus_img").onmouseover = function () { myOver() };
    document.getElementById("parallelogram_img").onmouseover = function () { myOver() };
    document.getElementById("ellipse_img").onmouseover = function () { myOver() };
    document.getElementById("text_img").onmouseover = function () { myOver() };
    document.getElementById("reset_img").onmouseover = function () { myOver() };
    document.getElementById("undo_img").onmouseover = function () { myOver() };
    document.getElementById("redo_img").onmouseover = function () { myOver() };
    document.getElementById("rect_img").onmouseout = function () { myOut() };
    document.getElementById("line_img").onmouseout = function () { myOut() };
    document.getElementById("rhombus_img").onmouseout = function () { myOut() };
    document.getElementById("parallelogram_img").onmouseout = function () { myOut() };
    document.getElementById("ellipse_img").onmouseout = function () { myOut() };
    document.getElementById("text_img").onmouseout = function () { myOut() };
    document.getElementById("reset_img").onmouseout = function () { myOut() };
    document.getElementById("undo_img").onmouseout = function () { myOut() };
    document.getElementById("redo_img").onmouseout = function () { myOut() };
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