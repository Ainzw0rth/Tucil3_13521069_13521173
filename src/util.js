/*
    input : File that get from input file form
    output : if valid get {node names, adj matrix} else get exception error
*/
function inputFromFile(file) {
return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsText(file);
    const nodeName = [];
    const adjMatrix = [];
    reader.onload = function () {
        // get file input
        var contents = reader.result?.toString();
        if (!contents)reject("file is empty"); // ? asumsi undefined karena empty
        contents = contents.replaceAll("\r", "");
        const contentLines = contents.split("\n");

        // get node amount
        const nodeAmount = parseInt(contentLines[0]);
        if (isNaN(nodeAmount))reject("Invalid Format, node amount is not integer");
        if (contentLines.length < (1 + 2 * nodeAmount))reject("Invalid Format, too few line");
        if (contentLines.length > (1 + 2 * nodeAmount))reject("Invalid Format, extra trailing line");

        // get node name
        for (var i = 1; i < 1 + nodeAmount; i++) {
            if(contentLines[i] === '')reject("Invalid Format, node name in line " + i + " is empty");
            if(nodeName.includes(contentLines[i]))reject("Invalid Format, node name in line " + i + " already used before");
            nodeName.push(contentLines[i]);
        }

        // get adjacency matrix
        for (var i = 1 + nodeAmount; i < 1 + 2 * nodeAmount; i++) {
            const line = contentLines[i].split(" ");
            const currentLine = i - nodeAmount;
            const errorMessage = "Invalid Format, adjacency matrix line " + currentLine;
            if (line.length < nodeAmount)reject(errorMessage + " have few column");
            if (line.length > nodeAmount)reject(errorMessage + " have extra column");

            const numLines = [];
            for (var j = 0; j < nodeAmount; j++) {
                const num = parseFloat(line[j]);
                if (isNaN(num))reject(errorMessage + " column " + (j + 1) + " value is not number");
                if (num < 0)reject(errorMessage + " column " + (j + 1) + " value is negative");
                numLines.push(num);
            }
            adjMatrix.push(numLines);
        }
        resolve([nodeName, adjMatrix]);
    };

    reader.onerror = function() {
        reject(reader.error);
    };
});
}

function nodeNameToNodeList(names){
    var list = [];
    const nodeAmount = names.length; // ? pengen pake foreach malah gajelas
    for (var i = 0; i < nodeAmount ; i++) {
        list.push({"name" : names[i]});
    }
    return list;
}

function adjMatrixToList(names, adjMatrix){
    var list = [];
    const nodeAmount = names.length;
    for (var i = 0; i < nodeAmount ; i++){
        for (var j = 0; j < nodeAmount ; j++){
            if(adjMatrix[i][j] === 0)continue;
            list.push({source : names[i], target : names[j], distance : adjMatrix[i][j]});
        }
    }
    return list;
}

function pathToList(names, adjMatrix, path){
    var list = [];
    const pathLength = path.length;
    for(var i = 1; i < pathLength;i++){
        list.push({source : names[path[i-1]], target : names[path[i]], distance : adjMatrix[path[i-1]][path[i]]});
    }
    return list;
}

function pathCost(path, adjMatrix){
    var cost = 0;
    const pathLength = path.length;
    for (var i = 1; i < pathLength; i++){
        cost += adjMatrix[path[i-1]][path[i]];
        curr = path[i];
    }
    return cost;
}