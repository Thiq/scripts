// turns WorldGuard areas into key-card access areas only.
import * as guid from 'guid';
import * as enderChest from 'ender-chest';

export class Keycard {
    id: string;
    stack;

    constructor() {
        this.id = guid();
        this.stack = itemStack({ type: org.bukkit.Material.IRON_NUGGET, lore: [ '\xA7k' + this.id.toString() ], displayName: '\xA7aKey', localizedName: '\xA7akey' });
    }

    serialize() {
        return {
            id: this.id,
            stack: this.stack
        };
    }

    deserialize(input) {
        this.id = input.id;
        this.stack = input.stack;
    }
}

registerEvent(player, 'interactEntity', (event) => {
    
});