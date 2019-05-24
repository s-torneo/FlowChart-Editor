// get canvas related references
var canvas, ctx, nodes = [], BB, offsetX, offsetY, WIDTH, HEIGHT;
// drag related variables
var dragok, startX, startY;
var choice = false; // = true => grid, else false
var dim = 10; //indicate the dimension of the grid's squares
var trashX = 1075, trashY = 467, trashW = 30, trashH = 30; //size and position of trash used to delete element on canvas

/*********/
var lineOffset = 4;
var anchrSize = 2;

var mousedown = false;
var clickedArea = { box: -1, pos: 'o' };
var x1 = -1;
var y1 = -1;
var x2 = -1;
var y2 = -1;

var boxes = [];
var tmpBox = null;
/********/

var trashY_actual = 467, endY = 767;
//draw trash
function drawTrash() {
    const image = document.getElementById('trash');
    var rid = document.getElementById("myBox").scrollTop;
    trashY_act = trashY + rid;
    if (trashY_act > (HEIGHT - 40))
        ctx.drawImage(image, trashX, endY, trashW, trashH);
    else
        ctx.drawImage(image, trashX, trashY + rid, trashW, trashH);
}

function drawGrid() {
    //grid width and height
    var bw = WIDTH;
    var bh = HEIGHT;
    //padding around grid
    var p = 10;
    //size of canvas
    var cw = bw + (p * 2) + 1;
    var ch = bh + (p * 2) + 1;
    ctx.beginPath();
    ctx.lineWidth = "1";
    ctx.strokeStyle = "grey";
    for (var x = 0; x <= bw; x += dim) {
        ctx.moveTo(0.5 + x + p, p);
        ctx.lineTo(0.5 + x + p, bh + p);
    }
    for (var x = 0; x <= bh; x += dim) {
        ctx.moveTo(p, 0.5 + x + p);
        ctx.lineTo(bw + p, 0.5 + x + p);
    }
    ctx.closePath();
    ctx.stroke();
}

// clear the canvas
function clear() {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    ctx.fillStyle = "aliceblue"; //"#FAF7F8"
    drawRect(0, 0, WIDTH, HEIGHT);
    ctx.fill();
}

// redraw the scene
function draw() {
    clear();
    if (choice)
        drawGrid();
    // redraw each rect in the rects[] array
    for (var i = 0; i < nodes.length; i++) {
        var r = nodes[i];
        if (r.id == "rectangle")
            drawRect(r.x, r.y, r.width, r.height);
        else if (r.id == "line")
            drawLine(r);
        else if (r.id == "rhombus")
            drawRhombus(r);
        else if (r.id == "parallelogram")
            drawParallelogram(r);
        else if (r.id == "ellipse")
            drawEllipse(r);
    }
    drawTrash();
    /*for (var i = 0; i < boxes.length; i++) {
        drawBoxOn(boxes[i]);
    }
    if (clickedArea.box == -1) {
        tmpBox = newBox(x1, y1, x2, y2);
        if (tmpBox != null) {
            drawBoxOn(tmpBox);
        }
    }*/
}

function init() {
    // get canvas related references
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    BB = canvas.getBoundingClientRect();
    offsetX = BB.left;
    offsetY = BB.top;
    WIDTH = canvas.width;
    HEIGHT = canvas.height;
    // drag related variables
    dragok = false;
    // listen for mouse events
    canvas.onmousedown = myDown;
    canvas.onmouseup = myUp;
    canvas.onmousemove = myMove;
    canvas.onmouseout = MyOut;
    canvas.ondblclick = myDoubleClick;
    // call to draw the scene
    draw();
    Menu();
}

function findCurrentArea(x, y) {
    for (var i = 0; i < boxes.length; i++) {
        var box = boxes[i];
        xCenter = box.x1 + (box.x2 - box.x1) / 2;
        yCenter = box.y1 + (box.y2 - box.y1) / 2;
        if (box.x1 - lineOffset < x && x < box.x1 + lineOffset) {
            if (box.y1 - lineOffset < y && y < box.y1 + lineOffset) {
                return { box: i, pos: 'tl' };
            } else if (box.y2 - lineOffset < y && y < box.y2 + lineOffset) {
                return { box: i, pos: 'bl' };
            } else if (yCenter - lineOffset < y && y < yCenter + lineOffset) {
                return { box: i, pos: 'l' };
            }
        } else if (box.x2 - lineOffset < x && x < box.x2 + lineOffset) {
            if (box.y1 - lineOffset < y && y < box.y1 + lineOffset) {
                return { box: i, pos: 'tr' };
            } else if (box.y2 - lineOffset < y && y < box.y2 + lineOffset) {
                return { box: i, pos: 'br' };
            } else if (yCenter - lineOffset < y && y < yCenter + lineOffset) {
                return { box: i, pos: 'r' };
            }
        } else if (xCenter - lineOffset < x && x < xCenter + lineOffset) {
            if (box.y1 - lineOffset < y && y < box.y1 + lineOffset) {
                return { box: i, pos: 't' };
            } else if (box.y2 - lineOffset < y && y < box.y2 + lineOffset) {
                return { box: i, pos: 'b' };
            } else if (box.y1 - lineOffset < y && y < box.y2 + lineOffset) {
                return { box: i, pos: 'i' };
            }
        } else if (box.x1 - lineOffset < x && x < box.x2 + lineOffset) {
            if (box.y1 - lineOffset < y && y < box.y2 + lineOffset) {
                return { box: i, pos: 'i' };
            }
        }
    }
    return { box: -1, pos: 'o' };
}

function newBox(x1, y1, x2, y2) {
    boxX1 = x1 < x2 ? x1 : x2;
    boxY1 = y1 < y2 ? y1 : y2;
    boxX2 = x1 > x2 ? x1 : x2;
    boxY2 = y1 > y2 ? y1 : y2;
    if (boxX2 - boxX1 > lineOffset * 2 && boxY2 - boxY1 > lineOffset * 2) {
        return {
            x1: boxX1,
            y1: boxY1,
            x2: boxX2,
            y2: boxY2,
            lineWidth: 1,
            color: 'DeepSkyBlue'
        };
    } else {
        return null;
    }
}

function drawBoxOn(box) {
    xCenter = box.x1 + (box.x2 - box.x1) / 2;
    yCenter = box.y1 + (box.y2 - box.y1) / 2;

    ctx.strokeStyle = box.color;
    ctx.fillStyle = box.color;

    ctx.rect(box.x1, box.y1, (box.x2 - box.x1), (box.y2 - box.y1));
    ctx.lineWidth = box.lineWidth;
    ctx.stroke();

    ctx.fillRect(box.x1 - anchrSize, box.y1 - anchrSize, 2 * anchrSize, 2 * anchrSize);
    ctx.fillRect(box.x1 - anchrSize, yCenter - anchrSize, 2 * anchrSize, 2 * anchrSize);
    ctx.fillRect(box.x1 - anchrSize, box.y2 - anchrSize, 2 * anchrSize, 2 * anchrSize);
    ctx.fillRect(xCenter - anchrSize, box.y1 - anchrSize, 2 * anchrSize, 2 * anchrSize);
    ctx.fillRect(xCenter - anchrSize, yCenter - anchrSize, 2 * anchrSize, 2 * anchrSize);
    ctx.fillRect(xCenter - anchrSize, box.y2 - anchrSize, 2 * anchrSize, 2 * anchrSize);
    ctx.fillRect(box.x2 - anchrSize, box.y1 - anchrSize, 2 * anchrSize, 2 * anchrSize);
    ctx.fillRect(box.x2 - anchrSize, yCenter - anchrSize, 2 * anchrSize, 2 * anchrSize);
    ctx.fillRect(box.x2 - anchrSize, box.y2 - anchrSize, 2 * anchrSize, 2 * anchrSize);
}


window.onload = init;