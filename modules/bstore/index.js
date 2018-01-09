// A module hook for the plugin BlockStore
var blockstore = getPlugin('BlockStore');
if (blockstore == null) throw new Error('BlockStore could not be located on this server');

exports.getMeta = function(block) {
    return blockstore.getMeta(block);
};

exports.setMeta = function(block, key, value) {
    blockstore.setMeta(block, getPlugin(), key, value);
};

exports.removeMeta = function(block, key) {
    blockstore.removeMeta(block, getPlugin(), key);
};

exports.containsMeta = function(block, key) {
    return blockstore.containsMeta(block, getPlugin(), key);
};