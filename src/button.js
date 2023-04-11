// graph input variable
var names;
var adjMatrix = null;

// input node awal dan akhir dari form input
var inputstart = document.getElementById("start");
var inputend = document.getElementById("end");
let startberubah = false;
let endberubah = false;
var startNode;
var endNode;

// realtime update value start
inputstart.addEventListener("input", () => {
  startberubah = true;
  updateValues();
});

// realtime update value end
inputend.addEventListener("input", () => {
  endberubah = true;
  updateValues();
});

var delay;
function updateValues() {
    startNode = inputstart.value;
    endNode = inputend.value;

    // jika waktu diubah valuenya jadi kosong
    if (startNode == "" || endNode == "") {
        // Reset the changed variables
        startberubah = false;
        endberubah = false;
    } 
    
    // run otomatis abis diubah
    if (startNode == "" || endNode == "" || adjMatrix == null){ // kalo masih ada yang kosong skip
        return;
    } else {
        clearTimeout(delay);
        if(document.getElementById('gotomaps'))delay = setTimeout(() => {shortestPath();}, 1000);
        else delay = setTimeout(() => {mapVisualize();}, 1000);
    }
}

document.getElementById('get_file').onclick = function() {
    document.getElementById('my_file').click();
};
  
document.getElementById('my_file').onchange = async function() {
    const file = this.files[0];
    try {
        // get input
        input = await inputFromFile(file);

        // set variable and visualize
        names = input[0];
        adjMatrix = input[1];
        nodes = nodeNameToNodeList(names);
        links = adjMatrixToList(names, adjMatrix);
        graphVisualize();
    }catch(err){
        alert(err);
    }
};

function gotomaps(){
    if(document.getElementById('gotomaps').checked){
        window.location='indexmap.html';
        return false;
    }
    return true;
}

function gotowithoutmaps(){
    if(document.getElementById('gotowithoutmaps').checked){
        window.location='index.html';
        return false;
    }
    return true;
}

// inisialisasi algo yang digunakan
var algo = "";

function using(value) {
    if (value == "UCS") {
        algo = ucs;
    } else if(value == "A*") {
        algo = "astar"; // TODO : ganti abis bikin A*
    } 

    if(document.getElementById('gotomaps')) { // if index.html
        if(adjMatrix == null)alert("Input file before run");
        if(startNode !== "" && endNode !== "") { // if start and end is not empty, execute right after
            shortestPath();
        }
    } else { // if indexmap.html
        if(markers.length == 0)alert("Choose node before run");
        if(startNode !== "" && endNode !== "") { // if start and end is not empty, execute right after
            mapVisualize();
        }
    } 
}

function shortestPath(){
    try{
        if (algo == "")throw "Select algorithm";
        if (algo == "astar")throw "A* belom dibikin bang"; // TODO : apus abis bikin A*
        if (startNode == "")throw "Start node is empty";
        if (endNode == "")throw "End node is empty";
        if (!names.includes(startNode))throw "Start node is not exist";
        if (!names.includes(endNode))throw "End node is not exist";

        const startIndex = names.indexOf(startNode);
        const endIndex = names.indexOf(endNode);

        const path = algo(adjMatrix, startIndex, endIndex);
        if (path.length === 0)throw "End node is not reachable from Start node";
        links2 = pathToList(names, adjMatrix, path);
        const cost = pathCost(path, adjMatrix);

        graphVisualize();
        updateJarak(cost);
    }catch(err){
        alert(err);
    }
}

// button util
function updateJarak(jarak) {
    var hasiljarak = document.getElementById('output-jarak');
    hasiljarak.textContent = jarak;
}