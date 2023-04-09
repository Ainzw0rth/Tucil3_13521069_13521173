
/* 
    input : File that get from input file form
    output : if valid get {node names, adj matrix} else get exception error
*/
function inputFromFile(file : File) : [string[], number[][]] {
  const reader : FileReader = new FileReader();
  reader.readAsText(file);
  const nodeName : string[] = [];
  const adjMatrix : number[][] = [];

  reader.onload = function() {
    // get file input
    var contents : string | undefined = reader.result?.toString();
    if(!contents)throw "file is empty"; // ? asumsi undefined karena empty
    contents = contents.replaceAll("\r", "");
    const contentLines : string[] = contents.split("\n");

    // get node amount
    const nodeAmount : number = parseInt(contentLines[0]);
    if(isNaN(nodeAmount))throw "Invalid Input, node amount is not integer";
    if(contentLines.length < (1 + 2 * nodeAmount))throw "Invalid Format, too few line";
    if(contentLines.length > (1 + 2 * nodeAmount))throw "Invalid Format, extra trailing line";

    // get node name
    for(var i = 1 ; i < 1 + nodeAmount ; i++){
      nodeName.push(contentLines[i]);
    }

    // get adjacency matrix
    for(var i = 1 + nodeAmount ; i < 1 + 2*nodeAmount ; i++){
      const line : string[] = contentLines[i].split(" ");
      const currentLine : number = i - nodeAmount;
      const errorMessage : string = "Invalid Format, adjacency matrix line " + currentLine;
      console.log(errorMessage)
      if(line.length < nodeAmount)throw errorMessage + " have few column";
      if(line.length > nodeAmount)throw errorMessage + " have extra column";
      const numLines : number[] = [];
      for(var j = 0 ; j < nodeAmount ; j++){
        const num : number = parseInt(line[j]); // ? mungkin bisa float
        if(isNaN(num))throw errorMessage + " column " + (j+1) + " value is not integer";
        numLines.push(num);
      }
      adjMatrix.push(numLines);
    }
  };
  return [nodeName, adjMatrix];
};

