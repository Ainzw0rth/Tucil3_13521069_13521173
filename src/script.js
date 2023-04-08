//initilize svg or grab svg
var svg = d3.select("svg");
var width = svg.attr("width");
var height = svg.attr("height");

//intialize data
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

var links = [
    {source: "1", target: "2"},
    {source: "1", target: "5"},
    {source: "1", target: "6"},
    {source: "2", target: "3"},
    {source: "2", target: "7"},
    {source: "3", target: "4"},
    {source: "8", target: "3"},
    {source: "4", target: "5"},
    {source: "4", target: "9"},
    {source: "5", target: "10"},  
    {source: "12", target: "10"},
];

var links2 = [
    {source: "12", target: "10"},
];

var simulation = d3
  .forceSimulation(nodes)
  .force(
    "link",
    d3
      .forceLink()
      .id(function(d) {
        return d.name;
      })
      .links(links)
  )

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
  if (d.source.name === "1" && d.target.name === "2") {
    return "blue"; // set color for Alice-Bob link
  } else {
    return "#999"; // default color
  }
});


var node = svg
  .append("g")
  .attr("class", "nodes")
  .selectAll("circle")
  .data(nodes)
  .enter()
  .append("circle")
  .attr("r", 5)
  .attr("fill", function(d) {
    return "red";
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

document.getElementById('get_file').onclick = function() {
  document.getElementById('my_file').click();
};

document.getElementById('my_file').onchange = function() {
  const file = this.files[0];
  try {
    input = inputFromFile(file);
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

// function dragstarted(d) {
//   if (!d3.event.active) simulation.alphaTarget(0.3).restart();
//   d.fx = d.x;
//   d.fy = d.y;
// }

// function dragged(d) {
//   d.fx = d3.event.x;
//   d.fy = d3.event.y;
// }

// function dragended(d) {
//   if (!d3.event.active) simulation.alphaTarget(0);
//   d.fx = null;
//   d.fy = null;
// }