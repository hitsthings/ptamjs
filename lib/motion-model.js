var jsfeat = require('jsfeat');

var struct = require('./struct');
var matrix = struct.floatMatrix;

var math = require('./math');

var Pose = require('./pose');

// Decay (multiplier) in the motion matrix each second
var decayPerSec = 0.8;

function Inertia(trans, rot) {
    this.translation = trans || matrix(4, 1);
    this.rotation = rot || matrix(4, 1);
}
Inertia.prototype.decay = function(secondsElapsed, outInertia) {
    outInertia = outInertia || this;

    // HACK: rounding. Take half the difference between the decay at the end and the decay at the beginning.
    // Use this as an estimate of the mean decayed velocity, rather than finding the real mean.
    // AKA, assume the decay is linear, when it is definitely not.
    var decayMultiplier = (1 + Math.pow(decayPerSec, secondsElapsed)) / 2;
    
    math.matrixMultScalar(this.translation, decayMultiplier, outInertia.translation);

    return outInertia;
};

module.exports = {
    calculateMotion : function(startingPose, endingPose) {
        var out = new Inertia();

        math.quaternionDiv(endingPose.getRotation(), startingPose.getRotation(), out.rotation);

        math.quaternionDiff(endingPose.getTranslation(), startingPose.getTranslation(), out.translation);

        // pose stores rotation and translation separately
        // inertia needs to be a local rotation, then a translation
        // so translation must be rotated "back" from the endingPose rotation.
        // rotate vector v by q = qvq*
        // rotate "back" = q*vq?
        var invRot = matrix(4, 1);
        math.quaternionInv(endingPose.getRotation(), invRot);
        math.quaternionMult(invRot, out.translation, out.translation);
        math.quaternionMult(out.translation, endingPose.getRotation());
        
        return out;
    },
    predictPose : function(previousPose, motion, secondsElapsed) {
        motion = motion || new Inertia();

        var prevTrans = previousPose.getTranslation();
        var prevRot = previousPose.getRotation();

        motion.decay(secondsElapsed);

        var newPose = new Pose();
        var tmp = matrix(4, 1);

        // adding rotations is q2q1, where q1 is the first rotation, q2 is second.
        math.quaternionMult(motion.rotation, prevRot, newPose._rot);

        // rotate the translation motion by new rotation. (otherwise the translation is sliding)
        // then add it to the previous translation.
        // rotate vector v by q = qvq*
        math.quaternionMult(newPose._rot, motion.translation, tmp);
        math.quaternionDiv(tmp, newPose._rot);

        math.quaternionAdd(tmp, prevTrans, newPose._trans);


        return newPose;
    }
};
