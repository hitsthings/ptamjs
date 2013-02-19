var jsfeat = require('jsfeat');

var FLOAT = jsfeat.F32_t | jsfeat.C1_t;
var PIXEL = jsfeat.U8_t | jsfeat.C4_t;
var GRAY = jsfeat.U8_t | jsfeat.C1_t;

exports.FLOAT = FLOAT;
exports.PIXEL = PIXEL;
exports.GRAY = GRAY;

function matrix(r, c, type) {
    return new jsfeat.matrix_t(c, r, type);
}
function floatMatrix(r, c) {
    return new jsfeat.matrix_t(c, r, FLOAT);
}
function pixelMatrix(r, c) {
    return new jsfeat.matrix_t(c, r, PIXEL);
}
function grayMatrix(r, c) {
    return new jsfeat.matrix_t(c, r, GRAY);
}

exports.pixelMatrix = pixelMatrix;
exports.grayMatrix = grayMatrix; 
exports.floatMatrix = floatMatrix;

function point2d(x, y, l, s) {
    return new jsfeat.point2d_t(x, y, l, s);
}

exports.point2d = point2d;
