// inisialisasi map dan id nodenya
var map = L.map('map').setView([-6.892, 107.612], 16);
var ctrmarker = 0; // id node
var redPath = [];
var bluePath = [];

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
}).addTo(map);

var adjacencyMatrix = []; 
var markers = []; // daftar marker

// onclick add marker
map.on('click', function(event) {
    var url = 'https://router.project-osrm.org/nearest/v1/driving/' + event.latlng.lng + ',' + event.latlng.lat;
    fetch(url).then(function(response) {
        return response.json();
    }).then(function(json) {
        // buat mengubah marker yang ada di gedung dll jadi di jalan terdekat
        var nearestPoint = L.latLng(json.waypoints[0].location[1], json.waypoints[0].location[0]);
        ctrmarker+=1;

        // label marker
        var myIcon = L.divIcon({
            className: 'my-icon',
            html: '<div>' + ctrmarker + '</div>',
            iconSize: [40, 40],
        });
        // masukkan marker beserta dengan atribut-atributnya
        var marker = L.marker(nearestPoint, {
            title: ctrmarker,
            icon: myIcon,
        }).addTo(map);
        
        var marker = L.marker(nearestPoint).addTo(map);
        // tambahkan marker ke dalam array
        markers.push(marker);
        
        var temp = [];
        for (let i = 0; i < markers.length-1; i++) {
            adjacencyMatrix[i].push(0)
        }

        for (let i = 0; i < markers.length; i++) {
            temp.push(0);
        }

        adjacencyMatrix.push(temp);
    });
});

function mapVisualize() {
    try{
        if (algo == "")throw "Select algorithm";
        // if (algo == "astar")throw "A* belom dibikin bang"; // TODO : apus abis bikin A*
        if (startNode == "")throw "Start node is empty";
        if (endNode == "")throw "End node is empty";

        const startIndex = parseInt(startNode) - 1;
        if(isNaN(startIndex))throw "Start node is not an integer";
        const endIndex = parseInt(endNode) - 1;
        if(isNaN(endIndex))throw "End node is not an integer";

        if (startIndex < 0 || startIndex >= ctrmarker)throw "Start node is not exist";
        if (endIndex < 0 || endIndex >= ctrmarker)throw "End node is not exist";

        var euclidArray = new Array(markers.length).fill(0);
        if(algo == "astar")euclidArray = makeEuclidArrayMap(endIndex);
        const path = pathFinding(adjacencyMatrix, startIndex, endIndex, euclidArray);
        if (path.length === 0)throw "End node is not reachable from Start node";
        const cost = pathCost(path, adjacencyMatrix);

        mapVisualizePath(path);
        updateJarak(cost);
    }catch(err){
        alert(err);
    }
}

// util
function mapVisualizePath(path) {
    for(let i = 0 ; i < bluePath.length ; i++){
        map.removeControl(bluePath[i]);
    }
    bluePath = [];

    const pathLength = path.length;
    for(let i = 1; i < pathLength ; i ++){
        var router = L.Routing.control({
            waypoints: [
                markers[path[i-1]].getLatLng(),
                markers[path[i]].getLatLng()
            ],
            lineOptions: {
            styles: [{color: 'blue', opacity: 0.7, weight: 5}]
            }
        })
        router.addTo(map);
        bluePath.push(router);
    }
}

function makeEuclidArrayMap(endIndex) { // get all euclid distance from marker to end node
    var euclidArray = new Array(markers.length).fill(0);
    for(let i = 0 ; i < markers.length ; i++) {
        euclidArray[i] = markers[i].getLatLng()
                                    .distanceTo(markers[endIndex].getLatLng());
    }
    console.log(euclidArray);
    return euclidArray;
}

function addEdge() {
    try {
        var source = document.getElementById("source").value;
        var target = document.getElementById("target").value;

        if (source == "" && target == "") throw "Select source node and target node";
        if (source == "") throw "Select source node";
        if (target == "") throw "Select target node";

        source = parseInt(source);
        target = parseInt(target);
        if (isNaN(source)) throw "Source node input is not an integer";
        if (isNaN(target)) throw "Target node input is not an integer";
        if (source > ctrmarker && target > ctrmarker) throw "Select node that already exists for source node and target node";
        if (source > ctrmarker) throw "Select node that already exists for source node";
        if (target > ctrmarker) throw "Select node that already exists for target node";
        if (source <= 0 && target <= 0) throw "Source node and target node input must be > 0";
        if (source <= 0) throw "Source node and input must be > 0";
        if (target <= 0) throw "Target node and input must be > 0";
        if (source == target) throw "Select nodes that are different"
        if (adjacencyMatrix[source - 1][target - 1] != 0) throw "Edge already exist, select a different one"
        
        var router = L.Routing.control({
            waypoints: [
                markers[source - 1].getLatLng(),
                markers[target - 1].getLatLng()
            ]
        });

        router.addTo(map);
        router.on('routesfound', function(e) {
            var route = e.routes[0];
            var distance = route.summary.totalDistance; // distance in meters
            adjacencyMatrix[source - 1][target - 1] = parseInt(distance);
        });
        console.log(adjacencyMatrix);
    } catch (err) {
        alert(err);
    }
}