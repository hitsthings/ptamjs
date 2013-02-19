var bindAll = require('./util').bindAll;
var util = require('util');
var EventEmitter = require('events').EventEmitter;

var Keyframe = require('./keyframe');
var Pose = require('./pose');
var motionModel = require('./motion-model');
var SanitizedVideoStream = require('./sanitized-video-stream');

var featureDetection = require('./feature-detection');

function Frame(id, videoData, features) {
    this.id = id;
    this.timestamp = videoData.timestamp;
    this.imagePyramid = videoData.grayscalePyramid;
    this.features = features;
}
Frame.NO_FRAME = new Frame(0, {});

function PoseEstimate(pose, frame, confidence) {
    this.pose = pose;
    this.frame = frame;
    this.confidence = confidence;
}
PoseEstimate.NO_ESTIMATE = new PoseEstimate(new Pose(), Frame.NO_FRAME, 1);
PoseEstimate.prototype.toJSON = function() {
    return {
        pose : this.pose,
        timestamp : this.frame.timestamp,
        confidence : this.confidence,
        frame : this.frame.id
    };
};

function Tracker(imageStream, map) {
    EventEmitter.call(this);

    bindAll(this, [
        '_videoDataReceived',
        '_addKeyframeIfGood',
        '_trackInertia'
    ]);

    this.lastPoseEstimate = PoseEstimate.NO_ESTIMATE;
    this.poseEstimate = PoseEstimate.NO_ESTIMATE;
    this.inertia = null;
    this.setImageStream(imageStream);
    this.setMap(map);

    this._initialKeyframesRegistered = 0;
    this._nextFrameId = 1;
    this._lastKeyframeId = null;

    this.on('poseEstimate', this._addKeyframeIfGood);
    this.on('poseEstimate', this._trackInertia);
}
util.inherits(Tracker, EventEmitter);

Tracker.prototype.setImageStream = function(imageStream) {
    if (this._videoStream) {
        this._videoStream.destroy();
    }
    if (imageStream) {
        this._videoStream = new SanitizedVideoStream();
        imageStream.pipe(this._videoStream);
        this._videoStream.on('data', this._videoDataReceived);   
    } else {
        this._videoStream = null;
    }
};

Tracker.prototype.setMap = function(map) {
    this._map = map;
};

Tracker.prototype.recordInitialKeyframe = function() {
    if (this._initialKeyframesRegistered >= 2) {
        console.warn('Initial keyframes have already been registered. Further keyframes will be chosen automatically.');
        return;
    }
    if (this.poseEstimate) {
        this._initialKeyframesRegistered++;
        this._addKeyframe(this.poseEstimate);
    }
};

Tracker.prototype._addKeyframe = function(poseEstimate) {
    var keyframe = new Keyframe(poseEstimate.pose, poseEstimate.frame.imagePyramid);
    this.emit('keyframe', keyframe);
    return keyframe;
}

function keyframeIsFarEnough(poseEstimate, lastKeyframeId) {
    return !lastKeyframeId || (lastKeyframeId <= poseEstimate.frame.id - 20);
}

function confidenceIsHighEnough(poseEstimate) {
    return poseEstimate.confidence > 0.2;
}

Tracker.prototype._addKeyframeIfGood = function(poseEstimate) {
    if (this._initialKeyframesRegistered < 2) return;

    var estimateMeetsRequirements =
            keyframeIsFarEnough(poseEstimate, this._lastKeyframeId) &&
            confidenceIsHighEnough(poseEstimate);
    if (estimateMeetsRequirements) {
        this._addKeyframe(poseEstimate);
    }
}

Tracker.prototype._trackInertia = function (newEstimate, oldEstimate) {
    if (oldEstimate) {
        this.inertia = motionModel.calculateMotion(oldEstimate.pose, newEstimate.pose);
    }
}

Tracker.prototype._videoDataReceived = function(videoData) {
    var frame = new Frame(this._nextFrameId++, videoData, [
        featureDetection.getBestFeatures(videoData.grayscalePyramid.data[0]),
        featureDetection.getBestFeatures(videoData.grayscalePyramid.data[1]),
        featureDetection.getBestFeatures(videoData.grayscalePyramid.data[2]),
        featureDetection.getBestFeatures(videoData.grayscalePyramid.data[3])
    ]);

    // 1. A new frame is acquired from the camera, and a-priori pose estimate is generated from a motion model.
    var aprioriPoseEstimate = this._generateAPrioriPoseEstimate(frame);

    // 2. Map points are projected into the image according to the frame's prior pose estimate.
    var mapPoints = this._projectMapPoints(frame, aprioriPoseEstimate);

    // 3. A small number (50) of the coarsest-scale features are searched for in the image.
    var coarseFeatures = this._findFeatureMatchesCoarse(frame);

    // 4. The camera pose is updated from these coarse matches.
    var coarsePoseEstimate = this._generatePoseEstimateFromFeatures(mapPoints, coarseFeatures, aprioriPoseEstimate);

    // 5. A larger number (1000) of points is re-projected and searched for in the image.
    var fineFeatures = this._findFeatureMatchesFine(frame, mapPoints, coarsePoseEstimate);

    // 6. A final pose estimate for the frame is computed from all the matches found.
    var finePoseEstimate = this._generatePoseEstimateFromFeatures(mapPoints, fineFeatures, coarsePoseEstimate);

    this.lastPoseEstimate = this.poseEstimate;
    this.poseEstimate = finePoseEstimate;
    this.emit('poseEstimate', this.poseEstimate, this.lastPoseEstimate);
};

Tracker.prototype._generateAPrioriPoseEstimate = function(frame) {
    var secondsElapsed = this.poseEstimate.timestamp ?
                            (frame.timestamp - this.poseEstimate.timestamp) / 1000 :
                            0;
    var estimatedPose = motionModel.predictPose(this.poseEstimate.pose, this.inertia, secondsElapsed);
    return new PoseEstimate(estimatedPose, frame, 0);
};

Tracker.prototype._projectMapPoints = function(frame, poseEstimate) {
    if (this._map) {
        var mapPoints = this._map.getMapPoints();
    }
    return [];
};

Tracker.prototype._findFeatureMatchesCoarse = function(frame) {
    //return featureDetection.getBestFeatures(frame.imagePyramid.data[3], 50);
};

Tracker.prototype._findFeatureMatchesFine = function(frame) {
    //return featureDetection.getBestFeatures(frame.imagePyramid.data[0], 1000);
};

Tracker.prototype._generatePoseEstimateFromFeatures = function(projectedMapPoints, features, priorPoseEstimate) {
    return priorPoseEstimate;
};

module.exports = Tracker;
