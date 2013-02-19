
var fastCorners = require('./image-processing').fastCorners;
var point2d = require('./struct').point2d;

var sortedSlice = require('./sorted-slice');

var CORNERS_THRESHOLD = 7;

var corners = [];
var i = 640*480; // good enough, probably will never hit the limit. If we do, can deal with it then.
while(--i >= 0) {
    corners[i] = point2d(0,0,0,0);
}
function scoreComparator(a, b) { return b.score - a.score; }
function clonePoint(p) { return point2d(p.x, p.y, p.level, p.score); }

module.exports.getBestFeatures = function(imageData, count, threshold) {
    var totalFeatures = fastCorners(threshold == null ? CORNERS_THRESHOLD : threshold, imageData, corners);
    var top = sortedSlice(corners, count == null ? Infinity : count, totalFeatures, scoreComparator);
    return top.map(clonePoint);
};

function FeatureMatch(imageFeature, expectedFeature) {

}

module.exports.findMatches = function(imageFeatures, expectedFeatures) {

};
