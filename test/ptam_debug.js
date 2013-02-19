var http = require('http');
var express = require('express');
var socketio = require('socket.io');

var app = express();
var server = http.createServer(app);
var io = socketio.listen(server);
io.set('log level', 1);

var videoStream;
var poseStream;

app.get('/', function (req, res, next) {
    res.sendfile(__dirname + '/ptam_debug.html');
});

io.sockets.on('connection', function(socket) {
    if (!videoStream) {
        socket.emit('noGrayscale');
    }
    if (!poseStream) {
        socket.emit('noPose');
    }
});

server.listen(5001);

module.exports.viewSanitizedStream = function(stream) {
    videoStream = stream;
    stream.on('data', function(data) {
        var top = data.grayscalePyramid.data[0];
        io.sockets.emit('grayscale', {
            grayscale : true,
            width : top.cols,
            height : top.rows,
            data : top.data
        });
    });
}; 

var frameCount = 0;
function emitPose(poseEstimate) {
    var trans = poseEstimate.pose._trans.data;
    var rot = poseEstimate.pose._rot.data;
    frameCount++;
    io.sockets.emit('pose', {
        timestamp : poseEstimate.timestamp,
        confidence : poseEstimate.confidence,
        pose : {
            translation : { zero : trans[0], x : trans[1], y : trans[2], z : trans[3] },
            rotation : { r : rot[0], i : rot[1], j : rot[2], k : rot[3] }
        }
    });
}
function emitFps() {
    io.sockets.emit('fps', frameCount);
    frameCount = 0;
}

module.exports.viewPoseUpdates = function(stream) {
    poseStream = stream;
    stream.on('poseEstimate', emitPose);
    setInterval(emitFps, 1000);
};
