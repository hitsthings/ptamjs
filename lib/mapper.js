var EventEmitter = require('events').EventEmitter;
var util = require('util');

var Map = require('./map');

function Mapper() {
    EventEmitter.call(this);
    this._map =  new Map();
    this._worker = require('child_process').fork('map-worker', [], {
        cwd: __dirname
    });
    var messageHandlers = {
        'update' : handleUpdate.bind(this),
        'default' : handleUnknown.bind(this)
    };
    this._worker.on('message', function(msg) {
        for(var type in msg) {
            (messageHandlers[type] || messageHandlers['default'])(msg[type]);
        }
    });
}
util.inherits(Mapper, EventEmitter);

Mapper.prototype.addKeyframe = function(keyframe) {
    this._map.addKeyframe(keyframe, true);
    this._worker.send({
        keyframe : keyframe.toJSON()
    });
};

Mapper.prototype.getMap = function() { return this._map; };

function handleUpdate(msg) {
    this.emit('update', null);
}

function handleUnknown(msg) {
    console.error(msg);
}

module.exports = Mapper;
