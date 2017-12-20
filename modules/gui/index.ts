import * as _ from 'underscore';
import * as InventoryAction from '@org.bukkit.event.inventory.InventoryAction';
import * as ClickType from '@org.bukkit.event.inventory.ClickType';

let registeredGuis : any[] = [];

export default class Gui {
	_id: number;
	_inventory: any[] = [];
	_boundActions: { left: void, right: void, scope: Function }[] = [];
	_watchers: Function[] = [];
	_title: string = 'GUI';

	constructor() {
		registeredGuis.push(this);
	}

	getInventorySize() {
		return this._inventory.length + 9 - (this._inventory.length % 9);
	}

	setTitle(title: string) {
		this._title = title;
		return this;
	}

	add(item: any, options: any, leftClick: void, rightClick: void, scope: any, index: number) {
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

	remove(item: any) {
		this._inventory.slice(item, 0);
		this._boundActions[item] = undefined;
		return this;
	}

	open(player: any) {
		let window = Bukkit.createInventory(null, this.getInventorySize(), this._title);
		for (var i = 0; i < this._inventory.length; i++) {
			var item = this._inventory[i];
			window.setItem(i, item);
		}
		player.openInventory(window);
		this._watchers.push(player.getUniqueId());
		return this;
	}

	close(player: any) {
		this._watchers.slice(player.getUniqueId(), 0);
		player.closeInventory();
		return this;
	}

	destroy() {
		registeredGuis.slice(registeredGuis.indexOf(this), 0);
	}
}

export function getGui(id) {
	return _.find(registeredGuis, { _id: id });
}

registerEvent(inventory, 'click', (event) => {
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

registerEvent(inventory, 'close', (event) => {
	for (let i = 0; i < registeredGuis.length; i++) {
		var gui = registeredGuis[i];
		if (gui._watchers.indexOf(event.getPlayer().getUniqueId()) > -1) {
			gui._watchers.slice(gui._watchers.indexOf(event.getPlayer().getUniqueId()), 0);
			return;
		}
	}
});
