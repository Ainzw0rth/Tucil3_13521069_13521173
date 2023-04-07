import { PriorityQueue } from './queue';

class activeNode {
    node : number;
    path : number[];
    cost : number;

    constructor(node : number, path : number[], cost : number) {
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
*/
function ucs(adjMatrix : number[][], start : number, target : number) : number[] {
    // Input Output variable
    const nodeAmount : number = adjMatrix.length;
    var path : number[] = [];

    // Search variable
    const visited : Boolean[] = Array<Boolean>(nodeAmount).fill(false);
    const comparator = (a : activeNode, b : activeNode) : number => {
        return a.cost - b.cost;
    };
    const queue : PriorityQueue<activeNode> = new PriorityQueue<activeNode>(comparator);
    
    // start search from start node
    const startNode : activeNode = new activeNode(start, [start], 0);
    visited[start] = true;
    queue.enqueue(startNode);

    // start searching
    var found : Boolean = false;
    while(!found){
        const currentNode : activeNode = queue.dequeue();
        visited[currentNode.node] = true;
        if(currentNode.node === target){ // reach target
            found = true; // found
            path = currentNode.path; // assign path
        }else{ // continue search
            for(var next : number = 0; next < nodeAmount; next++){
                if(visited[next])continue; // skip if visited

                // set new value
                const nextpath : number[] = [...currentNode.path, next];
                const nextcost : number = currentNode.cost + adjMatrix[currentNode.node][next];
                const nextNode : activeNode = new activeNode(next, nextpath, nextcost);

                // queueing to search next node
                queue.enqueue(nextNode);
            }
        }
    }

    return path;
}


function mainTest() {
    const adjMatrix: number[][] = [
        [0, 4, 6, 8],
        [4, 0, 1, 2],
        [6, 1, 0, 3],
        [8, 2, 3, 0],
    ];

    const ans : number[] = ucs(adjMatrix, 0, 2);
    console.log(ans);

    const ans2 : number[] = ucs(adjMatrix, 0, 3);
    console.log(ans2);
}
// mainTest()
