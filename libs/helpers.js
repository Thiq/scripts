// Helpers file that can be used across Thiq

Object.prototype.giveItem = function(item) {
    try {
        var inventory = this.getInventory();
        inventory.addItem(item);
    } catch (e) {
        throw 'Object has no inventory. Cannot call .giveItem()';
    }
};

Object.extend = function(source, target) {
    var properties = Object.getOwnPropertyNames(source);
    for (var i = 0; i < properties.length; i++) {
        var property = properties[i];
        target[property] = source[property];
    }
}