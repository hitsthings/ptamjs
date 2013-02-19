var Stream = require('stream');
var jsfeat = require('jsfeat');
var struct = require('./struct');
var grayMatrix = struct.grayMatrix;

var bindAll = require('./util').bindAll;

/**
 * A Stream that receives imageData ({ width:int, height:int, data: RGBA uint8 array, timestamp: optional date/int })
 * and emits grayscale, 4-level, jsfeat pyramids of the image. Level 0 is full image in grayscale,
 * level 1 is half dimensions, 2 => quarter, 3 => 1/8th.
 */
function SanitizedVideoStream() {
    Stream.call(this);

    this._grayMatrix = undefined;

    bindAll(this, [ 'write', 'end', 'destroy', 'destroySoon', 'pause', 'resume' ]);

    this._paused = false;
    this._pending = [];

    this._open = true;
}
SanitizedVideoStream.prototype = Object.create(Stream.prototype);
SanitizedVideoStream.prototype.readable = true;
SanitizedVideoStream.prototype.writable = true;

SanitizedVideoStream.prototype.write = function(imageData) {
    if (!this._open) {
        return false;
    }

    if (this._paused) {
        this._pending.push(imageData);
        return false;
    }

    if (imageData) {
        // don't create a new matrix each time, just set the same one - we won't expose it.
        if (!this._grayMatrix ||
            (this._grayMatrix.cols !== imageData.width) ||
            (this._grayMatrix.rows !== imageData.height)) {
            this._grayMatrix = grayMatrix(imageData.height, imageData.width);
        }
        console
        // convert RGBA array (4 * U8) into grayscale matrix (1 * U8) 
        jsfeat.imgproc.grayscale(imageData.data, this._grayMatrix.data);
        
        var pyramid = new jsfeat.pyramid_t(4);
        pyramid.allocate(this._grayMatrix.cols, this._grayMatrix.rows, jsfeat.U8_t | jsfeat.C1_t);
        pyramid.build(this._grayMatrix, false);

        this.emit('data', {
            timestamp : imageData.timestamp || Date.now(),
            grayscalePyramid : pyramid
        });
    }
    return true;
};

SanitizedVideoStream.prototype.end = function() {
    this.write.apply(this, arguments);
    this.emit('end');
    this.destroy();
};
SanitizedVideoStream.prototype.destroySoon = SanitizedVideoStream.prototype.end;

SanitizedVideoStream.prototype.destroy = function() {
    this._grayMatrix = undefined;
    this.emit('close');
};

SanitizedVideoStream.prototype.setEncoding = function() { /* noop */};

SanitizedVideoStream.prototype.pause = function() {
    this._paused = true;
};

SanitizedVideoStream.prototype.resume = function() {
    this._paused = false;
    while(this._pending.length) {
        this.write(this._pending.shift());
    }
    this.emit('drain');
};

module.exports = SanitizedVideoStream;
