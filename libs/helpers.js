// Helpers file that can be used across Thiq

Object.prototype.giveItem = function(item) {
    try {
        var inventory = this.getInventory();
        inventory.addItem(item);
    } catch (e) {
        throw 'Object has no inventory. Cannot call .giveItem()';
    }
};