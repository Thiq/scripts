/*
example usage: 
questableNpc('MyNpc')
	.addQuest(
		quest('My Quest')
			.say([
				'Hello traveler!',
				'How are you this fine day?',
				'Can you run some tasks for me?'
			])
			.break(5, 'cobblestone') // requests you break 5 cobblestone
			.craft(1, 'wooden pickaxe') // requests you craft a wooden pickaxe
			.kill(2, 'zombies') // requests you kill 2 zombies
			.fish(3, 'salmon') // requests you fish 2 salmon
			.grow(1, 'potato') // requests you grow a potato
			.smelt(10, 'iron ingots') // requests you smelt 10 iron ingots
			.locate(npc({
				name: 'My Dog',
				type: 'creeper'
			})) //requests you to locate an object.
			.reward(20, 'diamonds') // rewards with 20 diamonds
			.plays(1) // players can only play it once
			.timeLimit(2) // the player has 2 days to complete
	)
*/

var rewards = require('./rewards');
var factory = require('./factory');
var test = require('async');

function QuestableNpc(name) {
	if (!name) throw 'NPC must have a name';
	var self = this;
	this.name = name;
	this.quests = [];

	this.addQuest = function(quest) {
		self.quests.push(quest); 
		return self;
	}

	return this;
}

function Npc(options) {
	this.name = options.name;
	this.type = options.type;
	this.location = options.location;

	return this;
}

var questActions = [
	'break',
	'place',
	'craft',
	'grow',
	'fish',
	'kill',
	'breed',
	'find',
	'smelt',
	'locate'
]

function QuestAction(action, count, target) {
	if (questActions.indexOf(action) == -1) throw 'Invalid action: ' + action;
	return { action: action, count: count, target: target };
}

function Quest(name) {
	if (!name) throw 'Quest must have a name';
	var self = this;
	this._name = name;
	this._say = [];
	this._actions = [];
	this._plays = -1;
	this._timeLimit = -1;
	this._reward = false;

	function addQuestAction(action, count, target) {
		// TODO: check validity of target
		self._actions.push(new QuestAction(action, count, target));
	}

	this.break = function(count, target) {
		addQuestAction('break', count, target);
		return self;
	}

	this.place = function(count, target) {
		addQuestAction('place', count, target);
		return self;
	}

	this.craft = function(count, target) {
		addQuestAction('craft', count, target);
		return self;
	}

	this.grow = function(count, target) {
		addQuestAction('grow', count, target);
		return self;
	}

	this.fish = function(count, target) {
		addQuestAction('fish', count, target);
		return self;
	}

	this.kill = function(count, target) {
		addQuestAction('kill', count, target);
		return self;
	}

	this.breed = function(count, target) {
		addQuestAction('breed', count, target);
		return self;
	}

	this.find = function(count, target) {
		addQuestAction('find', count, target);
		return self;
	}

	this.smelt = function(count, target) {
		addQuestAction('smelt', count, target);
		return self;
	}

	this.locate = function(count, target) {
		addQuestAction('locate', count, target);
	}

	this.plays = function(playsCount) {
		self._plays = playsCount;
		return self;
	}

	this.timeLimit = function(timeLimit) {
		self._timeLimit = timeLimit;
		return self;
	}

	this.reward = function(rewardedItem) {
		self._reward = rewards.createReward(rewardedItem);
		return self;
	}
}

exports.npc = Npc;
exports.questableNpc = QuestableNpc;
exports.quest = Quest;
exports.questAction = QuestAction;
exports.questActions = questActions;