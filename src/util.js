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
        if (isNaN(nodeAmount))reject("Invalid Input, node amount is not integer");
        if (contentLines.length < (1 + 2 * nodeAmount))reject("Invalid Format, too few line");
        if (contentLines.length > (1 + 2 * nodeAmount))reject("Invalid Format, extra trailing line");

        // get node name
        for (var i = 1; i < 1 + nodeAmount; i++) {
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
                const num = parseInt(line[j]); // ? mungkin bisa float
                if (isNaN(num))reject(errorMessage + " column " + (j + 1) + " value is not integer");
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
