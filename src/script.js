//initilize svg
var svg = d3.select("svg");
var width = svg.attr("width");
var height = svg.attr("height");

// JIKA ELEMEN INI ISINYA DIUBAH, MAKA OTOMATIS VISUALISASI JUGA AKAN BERUBAH
// inisialisasi semua elemen-elemen graf
var nodes = [
    {name: "1"},
    {name: "2"},
];

// daftar hubungan antar node
var links = [
];

// daftar hubungan antar node yang merupakan shortest path
var links2 = [
];

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
  .attr("r", 15)
  .attr("fill", function(d) {
    return "red";
  })
  .call(
    d3
      .drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended)
  );
  
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
    .attr("y2", function(d) { return d.target.y; });

  node
    .attr("cx", function(d) { return d.x; })
    .attr("cy", function(d) { return d.y; });

  nodelabel
    .attr("x", function(d) { return d.x + 25; })
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

// semua buttons di page
document.getElementById('get_file').onclick = function() {
  document.getElementById('my_file').click();
};

document.getElementById('my_file').onchange = async function() {
  const file = this.files[0];
  try {
    input = await inputFromFile(file);
    console.log("success");
    console.log(input);
    // TODO : ubah hasil input jadi graf
  }catch(err){
    console.log(err); // TODO : tampilin error beneran
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

// utility functions
function isItInList(links, data){
  for (var i = 0; i < links.length; i++) {
    if (links[i].source === data.source.name && links[i].target === data.target.name && links[i].distance === data.distance) {
      return true;
    }
  }
  return false;
}

function refresh() {
  simulation.nodes(nodes).restart();
  node = node.data(nodes, function(d) { return d.name; });
  node.exit().remove();
  node = node.enter().append("circle")
      .attr("r", 15)
      .attr("fill", function(d) {
        return "red";
      })
      .merge(node)
      .call(
        d3
          .drag()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended)
      );
  nodelabel = nodelabel.data(nodes, function(d) { return d.name; });
  nodelabel.exit().remove();
  nodelabel = nodelabel.enter().append("text")
      .attr("class", "node-label")
      .text(function(d) { return d.name; })
      .merge(nodelabel);
}