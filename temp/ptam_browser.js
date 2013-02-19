function EventEmitter() {
    var callbacks = {};

    // Array Remove - By John Resig (MIT Licensed)
    // Butchered - By Adam Ahmed (WTFPL Licensed, lawl)
    function remove(arr, from, to) {
      var rest = arr.slice((to || from) + 1 || arr.length);
      arr.length = from < 0 ? arr.length + from : from;
      return arr.push.apply(arr, rest);
    }

    function on(name, fn) {
        if (!callbacks[name]) {
            callbacks[name] = [];
        }
        callbacks[name].push(fn);
    }

    function once(name, fn) {
        on(name, function() {
            remove(callbacks[name], callbacks[name].indexOf(fn));
            return fn.apply(this, arguments);
        });
    }

    function emit(name) {
        var cbs = callbacks[name];
        if (!(cbs && cbs.length)) {
            return;
        }

        var args = Array.prototype.slice.call(arguments, 1);
        cbs = cbs.slice(); // avoid mutation during loop
        for(var i = 0, len = cbs.length; i < len; i++) {
            cbs[i].apply(null, args);
        }
    }

    this.on = on;
    this.once = once;
    this.emit = emit;
}
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