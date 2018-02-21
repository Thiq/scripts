// creates keycards for anything in game.
// Should we consider switching from GUIDs to SHA256? The GUIDs never show in game, so we can assume the player won't know the GUIDs, and locked objects have no visual reference to GUIDs.
import * as guid from 'guid';
import * as enderChest from 'ender-chest';
import * as _ from 'underscore';

const table = enderChest.getTable('keycard');

class Keycard {
    name: string;
    id: string;
    private static $masterKey: Keycard = Keycard.deserialize(table.get('master_key'));

    constructor(name) {
        this.name = name;
        this.id = guid().toString();
    }

    getItemStack() {
        return itemStack({
            type: org.bukkit.Material.IRON_NUGGET,
            lore: [
                `\xA7k${this.id}`
            ],
            displayName: `\xA7a${this.name} Key`,
            localizedName: `\xA7a${this.name.toLowerCase()}_key`
        });
    }

    save() {
        let keys = table.get('keys');
        let indexOfKey = _.findIndexOf(keys, { id: this.id });
        if (indexOfKey > -1) {
            keys[indexOfKey] = this;
        } else {
            keys.push(this);
        }
        table.save();
    }

    serialize() {
        return {
            name: this.name,
            id: this.id,
        };
    }

    static loadFromItemStack(itemStack) {
        if (itemStack.type != org.bukkit.Material.IRON_NUGGET) return undefined;
        var meta = itemStack.getItemMeta();
        var lore = meta.getLore();
        var id = lore.split('\xA7k')[1];
        var index = _.findIndexOf(table.get('keys'), { id: id });
        if (index == -1) return undefined;
        var key = table.get('keys')[index];
        return this.deserialize(key);
    }

    static deserialize(input) {
        if (!input) return undefined;
        if (!input.name || !input.id) return undefined;
        var key = new Keycard(input.name);
        key.id = input.id;
        return key;
    }

    static masterKey() {
        if (!this.$masterKey) {
            this.$masterKey = new Keycard('Master');
            table.set('master_key', this.$masterKey.serialize());
        }
        return this.$masterKey;
    }
}

abstract class KeyLockedObject {
    keyId: string;
}

eventHandler('player', 'interact', (event) => {
    let block = event.getClickedBlock();
    // see if the block is a locked block/area
});