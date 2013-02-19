var EventEmitter = require('events').EventEmitter;
function MapMaker() {

}
/*globals MapMaker:false */

function PTAM() {
	this.mapMaker = new MapMaker();
}
PTAM.prototype.onImage = function() {

};
PTAM.prototype.onVelocityHint = function() {

};
PTAM.prototype.onOrientationHint = function() {
	
};
/*globals PTAM: false */

exports.createPTAM = function() {
	return new PTAM();
};