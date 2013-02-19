var has = Object.prototype.hasOwnProperty;

module.exports = function(a, b) {
    for(var i in b) {
        if (has.call(b, i) && b[i] !== undefined) {
            a[i] = b[i];
        }
    }
    return a;
};
