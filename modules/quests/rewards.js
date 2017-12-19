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

function createRewardGiveAction(item) {
	return function(player) {
		player.giveItem(item);
	}
}

function createReward(reward) {
	if (typeof reward != 'function') {
		return createRewardGiveAction(reward);
	} else {
		return reward;
	}
}

exports.createReward = createReward;