function Map() {
    //points in World coordinate system
    this._mappoints = [];

    // keyframes - image info from various points in time
    this._keyframes = [];
}
Map.prototype.addKeyframe = function(keyframe, createMapPoints) {
    this._keyframes.push(keyframe);
    if (createMapPoints) {
        throw 'TODO';
    }
};

Map.prototype.getMapPoints = function() {
    return this._mappoints;
};

module.exports = Map;
