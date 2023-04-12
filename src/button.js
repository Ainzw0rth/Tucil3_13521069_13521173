// graph input variable
var names;
var adjMatrix = null;

// inisialisasi algo yang digunakan
var algo = "";

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
    if (startNode == "" || endNode == "" || algo == "" ||
        (document.getElementById('gotomaps') && adjMatrix == null) || 
        (document.getElementById('gotowithoutmaps') && markers.length == 0)){ // kalo masih ada yang kosong skip
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
        setScale(adjMatrix);
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

function using(value) {
    if (value == "UCS") {
        algo = "ucs";
    } else if(value == "A*") {
        algo = "astar";
    } 

    if(document.getElementById('gotomaps')) { // if index.html
        if(adjMatrix == null)alert("Input file before run");
        else if(startNode !== "" && endNode !== "") { // if start and end is not empty, execute right after
            shortestPath();
        }
    } else { // if indexmap.html
        if(markers.length == 0){alert("Choose node before run");}
        else if(startNode !== "" && endNode !== "") { // if start and end is not empty, execute right after
            mapVisualize();
        }
    } 
}

function shortestPath(){
    try{
        if (algo == "")throw "Select algorithm";
        if (startNode == "")throw "Start node is empty";
        if (endNode == "")throw "End node is empty";
        if (!names.includes(startNode))throw "Start node is not exist";
        if (!names.includes(endNode))throw "End node is not exist";

        const startIndex = names.indexOf(startNode);
        const endIndex = names.indexOf(endNode);
        if (startIndex == endIndex)throw "Select nodes that are different";

        var euclidArray = new Array(names.length).fill(0);
        if(algo == "astar")euclidArray = makeEuclidArrayFile(endIndex);
        const path = pathFinding(adjMatrix, startIndex, endIndex, euclidArray);
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

function getEuclidDistance(index1, index2) {
    const x1 = nodes[index1].x;
    const x2 = nodes[index2].x;
    const y1 = nodes[index1].y;
    const y2 = nodes[index2].y;
    const dx = Math.abs(x1 - x2);
    const dy = Math.abs(y1 - y2);
    const dist = Math.sqrt(dx*dx + dy*dy) / 100;
    return dist;
}

function makeEuclidArrayFile(endIndex) {
    var euclidArray = new Array(names.length).fill(0);
    for(let i = 0 ; i < names.length ; i++) {
        const euclidDistance = getEuclidDistance(i, endIndex);
        if(euclidDistance == 0)euclidArray[i] = 0; // bikin kasus khusus biar gak keluar domain scale
        else euclidArray[i] = scale.invert(euclidDistance);
    }
    console.log(euclidArray);
    return euclidArray;
}