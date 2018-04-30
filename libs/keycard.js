const guid = require('guid');
const enderChest = require('ender-chest');
const _ = require('underscore');

const table = enderChest.getTable('keycard');


function Keycard(name) {
    this.name = name;
    this.id = guid().toString();
}

Keycard.deserialize = function(input) {
    if (!input) return undefined;
    if (!input.name || !input.id) return undefined;
    var key = new Keycard(input.name);
    key.id = input.id;
    return key;
}

Keycard.loadFromItemStack = function(itemStack) {
    if (itemStack.type != org.bukkit.Material.IRON_NUGGET) return undefined;
    var meta = itemStack.getItemMeta();
    var lore = meta.getLore();
    var id = lore.split('\xA7k')[1];
    var index = _.findIndexOf(table.get('keys'), { id: id });
    if (index == -1) return undefined;
    var key = table.get('keys')[index];
    return this.deserialize(key);
}

Keycard.masterKey = function() {
    if (!masterkey) {
        masterkey = new Keycard('Master Key');
        table.set('master_key', masterkey);
    }
    return masterkey;
}

Keycard.prototype.getItemStack = function() {
    return itemStack({
        type: org.bukkit.Material.IRON_NUGGET,
        lore: [ `\xA7k${this.id}` ],
        displayName: `\xA7a${this.name} Key`,
        localizedName: `\xA7a${this.name.toLowerCase()}_key`
    });
}

Keycard.prototype.save = function() {
    let keys = table.get('keys');
    let indexOfKey = _.findIndex(keys, { id: this.id });
    if (indexOfKey > -1) keys[indexOfKey] = this;
    else keys.push(this);
    table.save();
}

const masterkey = Keycard.deserialize(table.get('master_key'));
exports.Keycard = Keycard;