var ptam = require('../lib');
var browsercam = require('./ptam_browsercaminput').getCamera();
var trackAndMap = ptam.createPTAM();
trackAndMap.setCamera(browsercam);

var ptam_debug = require('./ptam_debug');
//ptam_debug.viewSanitizedStream(trackAndMap.tracker._videoStream);
ptam_debug.viewPoseUpdates(trackAndMap.tracker);




process.stdin.resume();
process.stdin.setEncoding('utf8');

process.stdin.on('data', function (chunk) {
  trackAndMap.recordInitialKeyframe();
});

process.stdin.on('end', function () {
  process.stdout.write('end');
});
