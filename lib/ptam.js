var EventEmitter = require('events').EventEmitter;
var Stream = require('stream');

//var FeatureStream = require('./feature-stream');
var Tracker = require('./tracker');
var Mapper = require('./mapper');

function PTAM() {
    var tracker = this.tracker = new Tracker();
    var mapper = this.mapper = new Mapper();

    mapper.on('update', function() {
        tracker.setMap(mapper.getMap());
    });

    tracker.on('keyframe', function(keyframe) {
        mapper.addKeyframe(keyframe);
    });
}

PTAM.prototype.setCamera = function(camera) {
    this.camera = camera || null;
    this.tracker.setImageStream(camera && camera.getImageStream() || null);
};

PTAM.prototype.recordInitialKeyframe = function() {
    this.tracker.recordInitialKeyframe();
};

module.exports = PTAM;
