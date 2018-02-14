/*
Reward objects to grant a player when a quest is completed. These can
be subsituted for reward strings in creating a quest. A reward object
must contain either a block to give or a function executed to give the
reward.
Example for a simple item:
var GoldCoin = createReward(itemStack('gold nugget', { lore: '10 Gold Coins' }));
Example for a more detailed reward:
var XpReward = createReward(function(player) {
	player.giveXp(10);
})
*/
import { ItemStack } from '@org.bukkit.inventory';

/**
 * A wrapper around a reward object for a quest.
 */
export class QuestReward {
	items: ItemStack[] = [];
	xp: number = 0;
	
	constructor(options: any) {
		this.items = options.items;
		this.xp = options.xp;
	}

	giveTo(player) {
		player.getInventory().add(this.items);
		player.giveExp(this.xp);
	}
}