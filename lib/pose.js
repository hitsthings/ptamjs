var jsfeat = require('jsfeat');
var struct = require('./struct');
var matrix = struct.floatMatrix;

/**
 * represent the position and orientation of an object
 * optionally pass in a rotation quaternion and/or translation vector
 */
function Pose(rot, trans) {
    if (!(this instanceof Pose)) {
        return new Pose(rot, trans);
    }

    if (rot instanceof Pose) {
        trans = rot.getTranslation();
        rot = rot.getRotation();
    }

    this._rot = rot || matrix(4, 1);
    this._trans = trans || matrix(4, 1);
}
/**
 * get the 3x1 translation vector of the object from the origin in world coordinates 
 */
Pose.prototype.getTranslation = function() {
    return this._trans;
};
/**
 * get the 3x1 rotation SORA vector representing the objects orientation.
 */
Pose.prototype.getRotation = function() {
    return this._rot;
};

/*var eigenVectors = matrix(3, 3);
var eigenValues = matrix(3, 1);

function approxEq(a, b) {
    return Math.abs(a - b) < jsfeat.EPSILON;
}*/

Pose.prototype.getAxisAndAngle = function() {
    throw new Error("unimplemented");
    var rot = this.getRotation().data;

    var mag = Math.sqrt(
        (rot[0] * rot[0]) +
        (rot[1] * rot[1]) +
        (rot[2] * rot[2])
    );

    var axis = matrix(3, 1);
    axis.data[0] = rot[0] / mag;
    axis.data[1] = rot[1] / mag;
    axis.data[2] = rot[2] / mag;

    return {
        axis : axis,
        angle : mag
    };

    /*jsfeat.linalg.eigenVV(rot, eigenVectors, eigenValues);
    var i = eigenValues.data.length;
    while(i--) {
        if (approxEq(1, eigenValues.data[i])) {
            var axis = matrix(3, 1);
            axis.set_data([
                eigenVectors.data[i],
                eigenVectors.data[i + 3],
                eigenVectors.data[i + 6]
            ]);
            var angle = Math.acos((rot.data[0] + rot.data[4] + rot.data[8] - 1)/2);
            return {
                axis : axis,
                angle : angle
            };
        }
    }
    throw new Error("Could not determine axis for rotation matrix");*/
};

module.exports = Pose;
