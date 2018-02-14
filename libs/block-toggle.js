// allows you to toggle a block from one to another
var enderChest = require('ender-chest');
var table = enderChest.getTable('block_toggle');
// the table is separated by worlds, which contain { vector: { from, to }}

exports.setToggle = function(from, to, position) {
    var contents = table.get(position.world.name) || {};
    var vector = position.toVector();
}

exports.toggle = function(position) {

}

exports.clearToggle = function(position) {

}