function findMax(arr, comparator) {
    return arr.reduce(function(maxIndex, val, i, arr) {
        return comparator(val, arr[maxIndex]) > 0 ? i : maxIndex;
    }, 0);
}

var _localeCompare = String.prototype.localeCompare;
function localeCompare(a, b) {
    return _localeCompare.call(a, b);
}

module.exports = function (arr, count, arr_end, comparator) {
    if (!arr || !arr.length) return [];

    if (typeof arr_end === 'function') {
        comparator = arr_end;
        arr_end = Infinity;
    } else if (!comparator) {
        comparator = localeCompare;
    }

    arr_end = Math.min(arr.length, arr_end);

    if (count === 0 || arr_end === 0) return [];

    if (count > arr_end) {
        return arr.slice(0, arr_end).sort(comparator);
    }

    var keepers = [arr[0]];
    var maxIn = 0;

    var i = arr_end;
    while(--i) {
        var diff = comparator(keepers[maxIn], arr[i]);
        if (diff >= 0) {
            if (keepers.length >= count) {
                keepers[maxIn] = arr[i];
                maxIn = findMax(keepers, comparator);
            } else {
                keepers.push(arr[i]);
            }
        } else if (keepers.length < count) {
            maxIn = keepers.push(arr[i]) - 1;
        }
    }
    return keepers.sort(comparator);
};
