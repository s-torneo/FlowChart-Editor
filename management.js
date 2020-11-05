elem = []; // array that contains all exercises of a traning sheet
curr = 0; // pointer of current element of the array elem

function AddImage(i, left_img, top_img, doc){
    filename = elem[i].image;
    if (filename != null){
        ext = filename.substr(filename.length-3, filename.length); // extract extension of filename
        doc.addImage(elem[i].code, ext, left_img, top_img, 70, 40);
    }
}

function GetCheckedValue(){
    if (document.getElementById('circuit').checked)
        return true;
    return false;
}

function ManageCircuit(){
    circuit = GetCheckedValue()
    if (circuit == false){
        document.getElementById('name_circuit').value = '';
        document.getElementById('note_circuit').value = '';
    }
}

function CreatePDF(){
    if (elem.length == 0)
        return;
    var doc = new jsPDF();
    name = document.getElementById('name').value;
    surname = document.getElementById('surname').value;
    doc.text(20, 20, 'Allenamento di: ' + name.toUpperCase() + " " + surname.toUpperCase());
    left1 = 20, init_top1 = 50;
    left2 = 90, init_top2 = 65;
    left_img = 15, top_img = 60;
    if (GetCheckedValue())
        doc.text(20, 35, 'Tipologia: CIRCUITO'); 
    for (var i = 0; i<elem.length; i++){
        doc.text(left1, init_top1, 'Esercizio: ' + elem[i].exercise);  
        AddImage(i, left_img, top_img, doc);  
        if (elem[i].repetition.length > 0){
            doc.text(left2, init_top2, 'Ripetizioni: ' + elem[i].repetition);
            init_top2 += 10;
        }
        if (elem[i].duration.length > 0){
            doc.text(left2, init_top2, 'Durata: ' + elem[i].duration);
            init_top2 += 10;    
        }
        if (elem[i].rest.length > 0){
            doc.text(left2, init_top2, 'Recupero: ' + elem[i].rest);
            init_top2 += 10;  
        }
        if (elem[i].note.length > 0){
            doc.text(left2, init_top2, 'Altro: ' + elem[i].note); 
            init_top2 += 10; 
        }
        init_top1 += 70;
        init_top2 = top_img = init_top1 + 10;
        if ((i+1) % 3 == 0 && i != elem.length-1){
            doc.addPage(); // new page
            left1 = 20, init_top1 = 50;
            left2 = 90, init_top2 = 65;
            left_img = 15, top_img = 60;
        }
    }
    var filename = name + "_" + surname + ".pdf";
    doc.save(filename);
}

function Confirm(){
    exercise = document.getElementById('exercise').value;
    repetition = document.getElementById('repetition').value;
    duration = document.getElementById('duration').value;
    rest = document.getElementById('rest').value;
    note = document.getElementById('note').value;
    if (exercise.length == 0)
        return;
    if (curr == elem.length) // add new element
        elem.push({exercise: exercise});
    else // modify an element
        elem[curr].exercise = exercise;
    elem[curr].repetition = repetition;
    elem[curr].duration = duration;
    elem[curr].rest = rest;
    elem[curr].note = note;
}

function Clear(){
    document.getElementById('exercise').value = '';
    document.getElementById('repetition').value = '';
    document.getElementById('duration').value = '';
    document.getElementById('rest').value = '';
    document.getElementById('note').value = '';
    DeleteImage();
}

function NewExercise(){
    if (elem.length == 0 || elem[curr].exercise.length == 0)
        return;
    Clear();
    curr++;
}

function ShowText(index){
    document.getElementById('exercise').value = elem[index].exercise;
    document.getElementById('repetition').value = elem[index].repetition;
    document.getElementById('duration').value = elem[index].duration;
    document.getElementById('rest').value = elem[index].rest;
    document.getElementById('note').value = elem[index].note;
}

function DisplayInfo(index){
    if (elem.length == 0)
        Clear();
    ShowText(index);
    DeleteImage();
    ShowImage(elem[index].image);
}

function Next(){
    if (curr == elem.length-1)
        return;
    curr++;
    DisplayInfo(curr);
}

function Back(){
    if (curr == 0)
        return;
    curr--;
    DisplayInfo(curr);
}

function Delete(){
    if (elem.length == 0)
        return;
    if (confirm('Vuoi cancellare questo esercizio?'))
        elem.splice(curr, 1);
    else
        return;
    if (elem.length == 0){
        DisplayInfo(curr);
        return;
    }
    if (curr > 0)
        curr--;
    DisplayInfo(curr);
}

function DeleteImage(){
    var image = document.getElementById('area_img');
    image.innerHTML = '';
}

function ShowImage(filename){
    if (filename == null)
        return;
    var img = document.createElement('img');
    img.src = filename;
    document.getElementById('area_img').appendChild(img);
}

function ChooseImage() {
    var input = document.createElement('input');
    input.type = "file";
    input.accept = "image/*";
    var element = document.getElementById('input_img').appendChild(input);
    element.style.display = 'none';
    element.click();
    input.addEventListener('change', function() {
        var file = element.files[0];
    	var reader = new FileReader();
    	reader.onloadend = function() {
            cod_base = reader.result; 
            elem[curr].code = cod_base;
    	}        
        reader.readAsDataURL(file);
        filename = 'Images/' + this.files[0].name;
        if (curr == elem.length) // add new element
            elem.push({image: filename});
        else // modify an element
            elem[curr].image = filename;
            DeleteImage();
        ShowImage(filename);
    });
}

function OpenFile(){
    if (elem.length > 0 && confirm('Vuoi salvare la scheda corrente?'))
        SaveFile();
    var input = document.createElement('input');
    input.type = "file";
    input.accept = ".json";
    var element = document.getElementById('input_div').appendChild(input);
    element.style.display = 'none';
    element.click();
    input.addEventListener('change', function() {
        var fr = new FileReader();
        fr.onload = function() {
            elem.splice(0, elem.length);
            var json = JSON.parse(this.result);
            for(var i=0;i<json.length-1;i++)
                elem.push(json[i]);
            document.getElementById('name').value = json[json.length-1].name;
            document.getElementById('surname').value = json[json.length-1].surname;
            document.getElementById("circuit").checked = json[json.length-1].circuit;
            curr = 0;
            DisplayInfo(curr);
        }
        fr.readAsText(this.files[0]);
        document.body.removeChild(element);
    });
}

function SaveFile() {
    if (elem.length == 0)
        return;
    // check if you want to save a json file with only an image and nothing other field set
    if (elem.length == 1 && elem[0].image.length > 0 && elem[0].exercise.length == 0)
        return;
    name = document.getElementById('name').value;
    surname = document.getElementById('surname').value;
    filename = name + "_" + surname + ".json";
    elem.push({name: name, surname: surname, circuit: GetCheckedValue()});
    var data = JSON.stringify(elem);
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(data));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    elem.splice(elem.length-1, 1);
}

function NewSheet(){
    if (elem.length > 0)
        if (confirm('Vuoi salvare la scheda corrente?'))
            SaveFile();
    elem.splice(0, elem.length);
    curr = 0;
    document.getElementById('name').value = '';
    document.getElementById('surname').value = '';
    document.getElementById("circuit").checked = false;
    Clear();
}

function About(){
    if (elem.length > 0)
        if (confirm('Vuoi salvare la scheda corrente?'))
            SaveFile();
    window.open('about.html', '_self', false);
}

function init(){}

window.onload = init;
