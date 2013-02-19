module.exports.bindAll = function(self, props) {
    props.forEach(function(name) {
        var unbound = self[name];
        self[name] = function() { return unbound.apply(self, arguments); };
    });
};
