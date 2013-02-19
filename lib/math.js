var jsfeat = require('jsfeat');
var struct = require('./struct');
var matrix = struct.floatMatrix;

function matrixAdd(a, b, c) {
    c = c || a;
    var cd = c.data;
    a = a.data;
    b = b.data;
    
    var i = cd.length;
    while(i--) {
        cd[i] = a[i] + b[i];
    }

    return c;
}

function matrixMult(a, b, out) {
    jsfeat.matmath.multiply(out, a, b);
}

function matrixMultScalar(mat, scalar, out) {
    var c = out || mat;
    var cd = c.data;

    var a = mat.data;

    var i = cd.length;
    while(i--) {
        cd[i] = a[i] * scalar;
    }

    return c;
}

function matrixDiff(a, b, c) {
    c = c || a;
    var cd = c.data;
    a = a.data;
    b = b.data;
    
    var i = cd.length;
    while(i--) {
        cd[i] = a[i] - b[i];
    }

    return c;
}

function quaternionInv(a, b) {
    b = b || a;

    b.data[0] = a.data[0];
    b.data[1] = -a.data[1];
    b.data[2] = -a.data[2];
    b.data[3] = -a.data[3];
    return b;
}

function quaternionAdd(a, b, c) {
    c = c || a;
    var cd = c.data;
    a = a.data;
    b = b.data;
    
    var i = cd.length;
    while(i--) {
        cd[i] = a[i] + b[i];
    }

    return c;
}

function quaternionDiff(a, b, c) {
    c = c || a;
    var cd = c.data;
    a = a.data;
    b = b.data;
    
    var i = cd.length;
    while(i--) {
        cd[i] = a[i] - b[i];
    }

    return c;
}

function quaternionMult(a, b, c) {
    c = c || a;
    var ar = a.data[0];
    var ai = a.data[1];
    var aj = a.data[2];
    var ak = a.data[3];
    var br = b.data[0];
    var bi = b.data[1];
    var bj = b.data[2];
    var bk = b.data[3];

    c.data[0] = ar*br - ai*bi - aj*bj - ak*bk;
    c.data[1] = ai*br + ar*bi + aj*bk - ak*bj;
    c.data[2] = ar*bj - ai*bk + aj*br + ak*bi;
    c.data[3] = ar*bk + ai*bj - aj*bi + ak*br;
    return c;
}

var tmpQ1 =  matrix(4, 1);
function quaternionDiv(a, b, c) {
    quaternionInv(b, tmpQ1);
    return quaternionMult(a, tmpQ1, c);
}

exports.quaternionInv = quaternionInv;
exports.quaternionAdd = quaternionAdd;
exports.quaternionDiff = quaternionDiff;
exports.quaternionMult = quaternionMult;
exports.quaternionDiv = quaternionDiv;
exports.matrixMult = matrixMult;
exports.matrixMultScalar = matrixMultScalar;
exports.matrixDiff = matrixDiff;
exports.matrixAdd = matrixAdd;
