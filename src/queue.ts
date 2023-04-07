export class PriorityQueue <T> {
    array : T[];
    private compareFunction : (a : T, b : T) => number

    constructor(compareFunction : (a : T, b : T) => number) {
        this.array = [];
        this.compareFunction = compareFunction;
    }

    enqueue(val : T) {
        this.array.push(val);
        this.array.sort(this.compareFunction); // ? masih O(n^2) mungkin bisa di optimize
    }

    dequeue() : T {
        const val : T = this.front();
        this.array.shift();
        return val;
    }

    isEmpty() : Boolean{
        return this.array.length === 0;
    }

    size() : number{
        return this.array.length;
    }

    front() : T{
        return this.array[0];
    }
}