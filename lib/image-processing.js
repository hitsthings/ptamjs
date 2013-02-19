var jsfeat = require('jsfeat');

module.exports = {
    fastCorners : function(threshold, greyscaleMatrix, corners_out) {
        jsfeat.fast_corners.set_threshold(threshold);
        var count = jsfeat.fast_corners.detect(greyscaleMatrix, corners_out);
        return count;
    }
};
