// ties and stores data to entities. Caution on usage as it can be resource heavy.
var ender = require('ender-chest');
var table = ender.getTable('estore');

exports.get = function(entityID, property) {
    return table.get(entityID)[property];
};

exports.set = function(entityID, property, value) {
    var old = table.get(entityID);
    old[property] = value;
    table.set(entityID, old);
};