//initilize svg
var svg = d3.select("svg");
var width = svg.attr("width");
var height = svg.attr("height");

// JIKA ELEMEN INI ISINYA DIUBAH, MAKA OTOMATIS VISUALISASI JUGA AKAN BERUBAH
// inisialisasi semua elemen-elemen graf
var nodes = [
  {name: "1"},
  {name: "2"},
  {name: "3"},
  {name: "4"},
  {name: "5"},
  {name: "6"},
  {name: "7"},
  {name: "8"},
  {name: "9"},
  {name: "10"},
  {name: "12"},
];

// daftar hubungan antar node
var links = [
  {source: "1", target: "2", distance: "40"},
  {source: "1", target: "5", distance: "40"},
  {source: "1", target: "6", distance: "40"},
  {source: "2", target: "3", distance: "40"},
  {source: "2", target: "7", distance: "40"},
  {source: "3", target: "4", distance: "40"},
  {source: "8", target: "3", distance: "40"},
  {source: "4", target: "5", distance: "40"},
  {source: "4", target: "9", distance: "40"},
  {source: "5", target: "10", distance: "40"},
  {source: "10", target: "5", distance: "40"},  
  {source: "12", target: "10", distance: "140"},
];

// daftar hubungan antar node yang merupakan shortest path
var links2 = [
  {source: "12", target: "10", distance: "140"},
];

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
  }
  
  // debug purposes
  // if ((startNode && endNode) || (startberubah && endNode) || (endberubah && startNode)) {
  //   // Do something with the input values
  //   console.log(`Start node: ${startNode}`);
  //   console.log(`End node: ${endNode}`);
  // }
}

function graphVisualize() {
  // reset svgnya terlebih dahulu
  svg.selectAll("*").remove();

  // simulasikan
  var simulation = d3.forceSimulation(nodes)
    .force("link", d3.forceLink().links(links).id(function(d) { return d.name; }).distance(function(d) { return d.distance * 4; }))
    .force("charge", d3.forceManyBody().strength(-30))
    .force("center", d3.forceCenter(width / 2, height / 2))
    .on("tick", ticked);
    
  var link = svg
    .append("g")
    .attr("class", "links")
    .selectAll("line")
    .data(links)
    .enter()
    .append("line")
    .attr("stroke-width", function(d) {
      return 3;
    })
    .attr("stroke", function(d) {
      if (isItInList(links2, d)) {
        return "blue"; // jika linknya adalah antara node yang merupakan shortest path
      } else {
        return "#999"; // jika default
      }
    });

  var linkLabels = svg.selectAll(".link-label")
    .data(links)
    .enter()
    .append("text")
    .attr("class", "link-label")
    .text(function(d) { return d.distance; });

  var node = svg
    .append("g")
    .attr("class", "nodes")
    .selectAll("circle")
    .data(nodes)
    .enter()
    .append("circle")
    .attr("r", 22)
    .attr("fill", "red")
    .call(
      d3
        .drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended)
    );
    
  svg.append("defs").append("marker")
    .attr("id", "arrow-blue")
    .attr("viewBox", "0 -5 10 10")
    .attr("refX", 19)
    .attr("refY", 0)
    .attr("markerWidth", 8)
    .attr("markerHeight", 8)
    .attr("orient", "auto-start-reverse")
    .append("path")
    .attr("fill", "blue")
    .attr("d", "M0,-5L10,0L0,5");

  svg.append("defs").append("marker")
    .attr("id", "default")
    .attr("viewBox", "0 -5 10 10")
    .attr("refX", 19)
    .attr("refY", 0)
    .attr("markerWidth", 10)
    .attr("markerHeight", 7)
    .attr("orient", "auto-start-reverse")
    .append("path")
    .attr("fill", "grey")
    .attr("d", "M0,-5L10,0L0,5");

  var nodelabel = svg.selectAll(".node-label")
    .data(nodes)
    .enter()
    .append("text")
    .attr("class", "node-label")
    .text(function(d) { return d.name; });

  // buat mengatur posisi elemen" di simulasi
  simulation.on("tick", function() {
    link
      .attr("x1", function(d) { return d.source.x; })
      .attr("y1", function(d) { return d.source.y; })
      .attr("x2", function(d) { return d.target.x; })
      .attr("y2", function(d) { return d.target.y; })
      .attr("marker-end", function(d) {
        if (isItInList(links2, d)) {
          return "url(#arrow-blue)";
        } else {
          return "url(#default)";
        }
      });

    node
      .attr("cx", function(d) { return d.x; })
      .attr("cy", function(d) { return d.y; });

    nodelabel
      .attr("x", function(d) { return d.x + 26; })
      .attr("y", function(d) { return d.y + 5; });

    linkLabels
      .attr("x", function(d) { return (d.source.x + d.target.x) / 2; })
      .attr("y", function(d) { return (d.source.y + d.target.y) / 2; });

    
  });

  function ticked() {
    link
    .attr("x1", function(d) {
      return d.source.x;
      })
      .attr("y1", function(d) {
        return d.source.y;
      })
      .attr("x2", function(d) {
        return d.target.x;
      })
      .attr("y2", function(d) {
        return d.target.y;
      });

    node
      .attr("cx", function(d) {
        return d.x;
      })
      .attr("cy", function(d) {
        return d.y;
      });
  }

  // efek drag
  function dragstarted(d) {
    if (!d3.event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  }

  function dragged(d) {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
  }

  function dragended(d) {
    if (!d3.event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  }
}

// semua buttons di page
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

// utility functions
function isItInList(links, data){
  for (var i = 0; i < links.length; i++) {
    if (links[i].source === data.source.name && links[i].target === data.target.name && links[i].distance === data.distance) {
      return true;
    }
  }
  return false;
}
