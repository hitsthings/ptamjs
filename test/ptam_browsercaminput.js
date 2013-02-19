var PNG = require('png-js');
var cam = require('browsercam');

var pending = false;

var last = 0;
var camstream = {
  pipe : function(writeStream) {
    cam.on('data', function(data) {
      //console.log('rcd: ' + new Date());
      if (pending) return; // throttle such that there is only ever one pending image.
      pending = true;
      process.nextTick(function() {
        pending = false;
        data = data.replace(/^data:image\/png;base64,/,"");
        data = new Buffer(data, 'base64');
        var png = new PNG(data);
        png.decode(function(data) {
          writeStream.write({
            data : data,
            width : png.width,
            height : png.height
          });
        });
      });
    });
  }
};

module.exports.getCamera = function() {
    return {
        getImageStream : function() { return camstream; }
    };
};
