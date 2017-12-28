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
			.timeLimit(2, 'days') // the player has 2 days to complete
	)
*/
import * as MDate from 'mdate';

export const QuestActions = [
  'break',
	'place',
	'craft',
	'grow',
	'fish',
	'kill',
	'breed',
	'collect',
	'smelt',
	'locate'
];

export class Quest {
  name: string;
  _actions: QuestAction[] = [];
  _say: string[] = [];
  _plays: number = -1;
  _time: number = -1;
  _reward: Function;
  _isCompletedSay: string[] = [];
  _isNotCompletedSay: string;
  _isFinalized: boolean = false;

  constructor(name: string) {
    this.name = name;
  }

  _addQuestAction(action, count, target) {
    this._actions.push(new QuestAction(action, count, target));
  }

  /**
   * Adds a break action requirement to the quest.
   * @param count 
   * @param target 
   */
  break(count: number, target: string): Quest {
    this._addQuestAction('break', count, target);
    return this;
  }

  /**
   * Adds a place action requirement to the quest.
   * @param count 
   * @param target 
   */
  place(count: number, target: string): Quest {
    this._addQuestAction('place', count, target);
    return this;
  }

  /**
   * Adds a craft action requirement to the quest.
   * @param count 
   * @param target 
   */
  craft(count: number, target: string): Quest {
    this._addQuestAction('craft', count, target);
    return this;
  }

  /**
   * Adds a grow action requirement to the quest.
   * @param count
   * @param target
   */
  grow(count: number, target: string): Quest {
    this._addQuestAction('grow', count, target);
    return this;
  }

  /**
   * Adds a fish action requirement to the quest.
   * @param count
   * @param target
   */
  fish(count: number, target: string): Quest {
    this._addQuestAction('fish', count, target);
    return this;
  }

  /**
   * Adds a kill action requirement to the quest.
   * @param count 
   * @param target 
   */
  kill(count: number, target: string): Quest {
    this._addQuestAction('kill', count, target);
    return this;
  }

  /**
   * Adds a breed action requirement to the quest.
   * @param count
   * @param target 
   */
  breed(count: number, target: string): Quest {
    this._addQuestAction('breed', count, target);
    return this;
  }

  /**
   * Adds a collection action requirement to the quest.
   * @param count 
   * @param target 
   */
  collect(count: number, target: string): Quest {
    this._addQuestAction('collect', count, target);
    return this;
  }

  /**
   * Adds a smelt action requirement to the quest.
   * @param count 
   * @param target 
   */
  smelt(count: number, target: string): Quest {
    this._addQuestAction('smelt', count, target);
    return this;
  }

  /**
   * Assigns the text dialog to the NPC of the quest where the quest hasn't been activated.
   * @param value
   */
  say(value: string[]): Quest {
    this._say = value;
    return this;
  }

  /**
   * Assigns the text dialog to the NPC of the quest when the quest has been activated and completed.
   * @param value 
   */
  isCompletedSay(value: string[]): Quest {
    this._isCompletedSay = value;
    return this;
  }

  /**
   * Assigns the text dialog to the NPC of the quest when the quest has been activated but not completed.
   * @param value 
   */
  isNotCompletedSay(value: string): Quest {
    this._isNotCompletedSay = value;
    return this;
  }

  /**
   * Assigns the reward of the quest.
   * @param reward Can be an org.bukkit.inventory.ItemStack object or a function that takes the player and quest
   * as the args (function(player, quest)) that is executed on completion.
   */
  reward(reward): Quest {
    this._reward = reward;
    return this;
  }

  /**
   * Assigns how many times the quest can be played through after the initial. If the value is negative, the quest is unplayable. 
   * @param count 
   */
  plays(count: number): Quest {
    this._plays = count;
    return this;
  }

  /**
   * Assigns how long the player has to complete the quest.
   * @param value 
   */
  timeLimit(value: number, timespan: string): Quest {
    return this;
  }

  /**
   * Tells the quest factory that the quest can be finalized for population and usage.
   * If this hasn't been called, a quest is not usable.
   */
  finalize() {
    // saves the quest and creates the handlers for it
    this._isFinalized = true;
  }

  isPlayable(player: PlayerQuestStatus) {
    return this._plays > player.plays;
  }
}

export class QuestableNpc {
  name: string;
  quests: Quest[] = [];

  constructor(name: string) {
    this.name = name;
  }

  addQuest(quest: Quest) {
    this.quests.push(quest);
    return this;
  }
}

class QuestAction {
  action;
  count;
  target;

  constructor(action, count, target) {
    this.action = action;
    this.count = count;
    this.target = target;
  }
}

export class QuestStatus {
  questId: string;
  startedAt: MDate;
  stepsCompleted: number = 0;
  playerId: string;

  constructor(questId: string, player) {
    this.questId = questId;
    this.startedAt = MDate.now(player.getWorld());
    this.playerId = player.getUniqueId();
  }
}

export class PlayerQuestStatus {
  questId: string;
  lastCompleted: MDate;
  plays: number;

  constructor(questId: string, lastCompleted: Date, plays: number = 0) {
    this.questId = questId;
    this.lastCompleted = lastCompleted;
    this.plays = plays;
  }
}
