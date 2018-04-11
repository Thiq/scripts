const _ = require('underscore');
const InventoryAction = require('@org.bukkit.event.inventory.InventoryAction');
const ClickType = require('@org.bukkit.event.inventory.ClickType');

let registeredGuis = [];

function Gui(title) {
    this.id = registeredGuis.length;
    this._inventory = [];
    this._boundActions = [];
    this._watchers = [];
    this._title = title || 'GUI';
    registeredGuis.push(this);
}

Gui.prototype.getInventorySize = function() {
    return this._inventory.length + 9 - (this._inventory.length % 9);
}

Gui.prototype.setTitle = function(title) {
    this._title = title;
    return this;
}

Gui.prototype.add = function(item, options, leftClick, rightClick, scope, index) {
    if (options != null) {
        let oldMeta = item.itemMeta;
        oldMeta.displayName = options.name;
        if (options.lore != undefined) {
            if (typeof options.lore == 'string') {
                oldMeta.setLore([options.lore]);
            } else {
                oldMeta.setLore(options.lore);
            }
        }
        item.itemMeta = oldMeta;
    }
    if (!index) {
        this._inventory.push(item);
    } else {
        this._inventory[index] = item;
    }
    this._boundActions[item] = {
        left: leftClick,
        right: rightClick,
        scope: scope
    }
    return this;
}

Gui.prototype.remove = function(item) {
    this._inventory.slice(item, 0);
	this._boundActions[item] = undefined;
	return this;
}

Gui.prototype.open = function(player) {
    let window = Bukkit.createInventory(null, this.getInventorySize(), this._title);
	for (var i = 0; i < this._inventory.length; i++) {
		var item = this._inventory[i];
		window.setItem(i, item);
	}
	player.openInventory(window);
	this._watchers.push(player.getUniqueId());
	return this;
}

Gui.prototype.close = function(player) {
    this._watchers.slice(player.getUniqueId(), 0);
	player.closeInventory();
	return this;
}

Gui.prototype.destroy = function() {
    registeredGuis.slice(registeredGuis.indexOf(this));
}

module.exports = Gui;


eventHandler('inventory', 'click', (event) => {
	for (let i = 0; i < registeredGuis.length; i++) {
		var gui = registeredGuis[i];
		if (event.getRawSlot() > gui.getInventorySize() - 1) continue;
		if (gui._watchers.indexOf(event.getWhoClicked().getUniqueId()) > -1) {
			if (event.getRawSlot() >= gui.getInventorySize()) return;
			if (event.getAction() == InventoryAction.PLACE_ONE || event.getAction() == InventoryAction.PLACE_ALL || event.getAction() == InventoryAction.PLACE_SOME || event.getClick() == ClickType.SHIFT_LEFT || event.getClick() == ClickType.SHIFT_RIGHT) {
				event.cancelled = true;
				return;
			}
			var boundItem = gui._boundActions[event.getCurrentItem()];
			if (!boundItem) return;
			if (event.getClick() == ClickType.LEFT && boundItem.left != undefined) {
				boundItem.left(event.getWhoClicked(), boundItem.scope);
				event.cancelled = true;
				return;
			}
			if (event.getClick() == ClickType.RIGHT && boundItem.right != undefined) {
				boundItem.right(event.getWhoClicked(), boundItem.scope);
				event.cancelled = true;
				return;
			}
		}
	}
});

eventHandler('inventory', 'close', (event) => {
	for (let i = 0; i < registeredGuis.length; i++) {
		var gui = registeredGuis[i];
		if (gui._watchers.indexOf(event.getPlayer().getUniqueId()) > -1) {
			gui._watchers.slice(gui._watchers.indexOf(event.getPlayer().getUniqueId()), 0);
			return;
		}
	}
});