class activeNode {
    node;
    path;
    cost;
    priority;
    constructor(node, path, cost, priority) {
        this.node = node;
        this.path = path;
        this.cost = cost;
        this.priority = priority;
    }
}

/*
    input : weighted adj matrix, start node index, target node index
    if aStarArray is all zero, then the algorithm is UCS, 
    else (aStarArray is not zero) algorithm is A*
    input format : 0-indexed
    output : arrays of pair, shortest path from start to target with ucs algorithm
    ex output : path = [1,2,3,4] means the path is 1->2->3->4
    if there is no path from start to end or start==end path will be []
*/
function pathFinding(adjMatrix, start, target, aStarArray) {
    var isAstar = (aStarArray.length !== 0)
    // Input Output variable
    const nodeAmount = adjMatrix.length;
    var path = [];

    // Search variable
    const visited = Array(nodeAmount).fill(false);
    const comparator = (a, b) => {
        return a.priority - b.priority;
    };
    const queue = new PriorityQueue(comparator);

    // start search from start node
    const startNode = new activeNode(start, [start], 0, 0);
    visited[start] = true;
    queue.enqueue(startNode);

    // start searching
    var found = false;
    while (!found && !queue.isEmpty()) {
        const currentNode = queue.dequeue();
        visited[currentNode.node] = true;
        if (currentNode.node === target) { // reach target
            found = true; // found
            path = currentNode.path; // assign path
        }else { // continue search
            for (let next = 0; next < nodeAmount; next++) {
                if (visited[next])continue; // skip if visited
                if (adjMatrix[currentNode.node][next] === 0)continue; // skip if no path

                // set new value
                const nextpath = [...currentNode.path, next];
                const nextcost = currentNode.cost + adjMatrix[currentNode.node][next];
                const nextpriority = nextcost + aStarArray[next];
                const nextNode = new activeNode(next, nextpath, nextcost, nextpriority);
                // console.log(nextpriority);
                
                // queueing to search next node
                queue.enqueue(nextNode);
            }
        }
    }
    return path;
}