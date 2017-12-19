import * as _ from 'underscore';

let registeredGuis : any[] = [];

export class Gui {
	_id: number;
	_inventory: any[] = [];
	_boundActions: { left: void, right: void, scope: any }[] = [];
	_watchers: void[] = [];
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
		registeredGuis.slice(registeredGuis.indexOf(this), 1);
	}
}

export function getGui(id) {
	return _.find(registeredGuis, { _id: id });
}