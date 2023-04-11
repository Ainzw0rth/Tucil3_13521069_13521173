// inisialisasi algo yang digunakan
var algo;

function using(value) {
    if (algo != value) {
        algo = value;
    }
}

// graph input variable
var names;
var adjMatrix;

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

function updateValues() {
  startNode = inputstart.value;
  endNode = inputend.value;

  // jika waktu diubah valuenya jadi kosong
  if (startNode == "" || endNode == "") {
    // Reset the changed variables
    startberubah = false;
    endberubah = false;
  } else {
    shortestPath();
  }
  
  // debug purposes
  // if ((startNode && endNode) || (startberubah && endNode) || (endberubah && startNode)) {
  //   // Do something with the input values
  //   console.log(`Start node: ${startNode}`);
  //   console.log(`End node: ${endNode}`);
  // }
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

function shortestPath(){
    try{
        if (startNode == "")throw "Start node is empty";
        if (endNode == "")throw "End node is empty";
        if (!names.includes(startNode))throw "Start node is not exist";
        if (!names.includes(endNode))throw "End node is not exist";

        const startIndex = names.indexOf(startNode);
        const endIndex = names.indexOf(endNode);

        const path = ucs(adjMatrix, startIndex, endIndex);
        if (path.length === 0)throw "End node is not reachable from Start node";
        links2 = pathToList(names, adjMatrix, path);
        const cost = pathCost(path, adjMatrix);

        console.log("cost : ", cost); // TODO : tampilin cost beneran
        graphVisualize();
    }catch(err){
        alert(err);
    }
}
