
/**
 * Camera interface
 */
function Camera(fu, fv, u0, v0, w) {
    this.fu = fu|0;
    this.fv = fv|0;
    this.u0 = u0|0;
    this.v0 = v0|0;
    this.w = w|0;
}

/**
 * Returns a stream that emits an image data object
 * on every write. An image data object looks like:
 * { width:int, height:int, data: RGBA uint8 array, timestamp: optional date/int }
 */
Camera.prototype.getImageStream = function() {
    throw new Error("Not yet implemented");
}

module.exports = Camera;

/**
 * A camera that shows a static random image
 */
Camera.createMockCamera = function(imageData) {
    var stream = new (require('stream'));
    stream.readable = true;

    var image = imageData || {
        height : 480,
        width : 640,
        data : new Uint8Array(new Array(640 * 480 * 4).map(function() {
            return Math.floor(Math.random() * 255);
        }))
    };

    setInterval(function() {
        stream.emit('data', image);
    }, 1000 / 60);

    return {
        fu : 1,
        fv : 1,
        u0 : 0,
        v0 : 0,
        w : 1,
        getImageStream : function() {
            return stream;
        }
    };
};
