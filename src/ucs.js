class activeNode {
    node;
    path;
    cost;
    constructor(node, path, cost) {
        this.node = node;
        this.path = path;
        this.cost = cost;
    }
}

/*
    input : weighted adj matrix, start node index, target node index
    input format : 0-indexed
    output : arrays of pair, shortest path from start to target with ucs algorithm
    ex output : path = [1,2,3,4] means the path is 1->2->3->4
    if there is no path from start to end or start==end path will be []
*/
function ucs(adjMatrix, start, target) {
    // Input Output variable
    const nodeAmount = adjMatrix.length;
    var path = [];

    // Search variable
    const visited = Array(nodeAmount).fill(false);
    const comparator = (a, b) => {
        return a.cost - b.cost;
    };
    const queue = new PriorityQueue(comparator);

    // start search from start node
    const startNode = new activeNode(start, [start], 0);
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
            for (var next = 0; next < nodeAmount; next++) {
                if (visited[next])continue; // skip if visited
                if (adjMatrix[currentNode.node][next] === 0)continue; // skip if no path

                // set new value
                const nextpath = [...currentNode.path, next];
                const nextcost = currentNode.cost + adjMatrix[currentNode.node][next];
                const nextNode = new activeNode(next, nextpath, nextcost);
                
                // queueing to search next node
                queue.enqueue(nextNode);
            }
        }
    }
    return path;
}

function mainTest() {
    const adjMatrix = [
        [0, 4, 6, 8],
        [4, 0, 1, 2],
        [6, 1, 0, 3],
        [8, 2, 3, 0],
    ];
    const ans = ucs(adjMatrix, 0, 2);
    console.log(ans);
    const ans2 = ucs(adjMatrix, 0, 3);
    console.log(ans2);
}
// mainTest()