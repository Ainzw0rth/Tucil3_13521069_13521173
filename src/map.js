// inisialisasi map dan id nodenya
var map = L.map('map').setView([-6.892, 107.612], 16);
var ctrmarker = 0; // id node
var redMarker = [];
var blueMarker = [];

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
            zIndexOffset: 100, // agar marker bisa diclick dan dilihat
        }).addTo(map).bindPopup(ctrmarker);
        
        // tambahkan marker ke dalam array
        markers.push(marker);
        
        var tempAdjacencylist = [];
        // kalau node sudah ada 2 bisa dicari edgenya
        // looping untuk menghubungkan node terbaru dengan node node yang telah ada     
        for (var i = 0; i < markers.length; i++) {
            var router = L.Routing.control({
                waypoints: [
                    markers[i].getLatLng(),
                    markers[markers.length - 1].getLatLng()
                ]
            });
            router.addTo(map);
            redMarker.push(router);

            var ctr = markers.length;
            router.on('routesfound', function(event) {
                var route = event.routes[0];
                var distance = route.summary.totalDistance;
                tempAdjacencylist.push(distance);
                if (i-ctr != markers.length-1) {
                    adjacencyMatrix[i-ctr].push(distance);
                }
                ctr-=1;
            });
        }
        adjacencyMatrix.push(tempAdjacencylist);
    });

    console.log(markers);
});

function mapVisualize() {
    try{
        if (algo == "")throw "Select algorithm";
        if (algo == "astar")throw "A* belom dibikin bang"; // TODO : apus abis bikin A*
        if (startNode == "")throw "Start node is empty";
        if (endNode == "")throw "End node is empty";

        const startIndex = parseInt(startNode) - 1;
        if(isNaN(startIndex))throw "Start node is not an integer";
        const endIndex = parseInt(endNode) - 1;
        if(isNaN(endIndex))throw "End node is not an integer";

        if (startIndex < 0 || startIndex >= ctrmarker)throw "Start node is not exist";
        if (endIndex < 0 || endIndex >= ctrmarker)throw "End node is not exist";


        console.log(adjacencyMatrix);
        const path = algo(adjacencyMatrix, startIndex, endIndex, false);
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
    for(var i = 0 ; i < blueMarker.length ; i++){
        map.removeControl(blueMarker[i]);
    }
    blueMarker = [];

    const pathLength = path.length;
    for(var i = 1; i < pathLength ; i ++){
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
        blueMarker.push(router);
    }
}