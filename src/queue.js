class PriorityQueue {
    array;
    compareFunction;
    constructor(compareFunction) {
        this.array = [];
        this.compareFunction = compareFunction;
    }
    enqueue(val) {
        this.array.push(val);
        this.array.sort(this.compareFunction); // ? masih O(n^2) mungkin bisa di optimize
    }
    dequeue() {
        const val = this.front();
        this.array.shift();
        return val;
    }
    isEmpty() {
        return this.array.length === 0;
    }
    size() {
        return this.array.length;
    }
    front() {
        return this.array[0];
    }
}
