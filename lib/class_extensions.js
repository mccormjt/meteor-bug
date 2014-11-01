Array.prototype.move = function (from, to) {
    this.splice(to, 0, this.splice(from, 1)[0]);
};

Array.prototype.switchElementsAtIndexes = function (index_1, index_2) {
    var temp = this[index_1];
    this[index_1] = this[index_2];
    this[index_2] = temp;
};