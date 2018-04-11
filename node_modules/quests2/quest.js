const QuestType = require('./types').QuestType;
const QuestObjective = require('./objectives').QuestObjective;

/**
 * Declares a reward for a quest.
 * @param {{items: *[], xp: Number}} options 
 */
function QuestReward(options) {
    this.items = options.items;
    this.xp = options.xp;
}

/**
 * Gives the reward to the specified player.
 * @param {*} player 
 */
QuestReward.prototype.giveTo = function(player) {
    player.getInventory().add(this.items);
    player.giveExp(this.xp);
}

exports.QuestReward = QuestReward;

/**
 * A quest model to be stored in the database of existing quests.
 * 
 * @param {String} name 
 */
function Quest(name) {
    this.name = name;
    this.objectives = [];
    this.reward = false;
    this.npcSpeechStart = [];
    this.npcSpeechFinish = [];
    this.endsOnPlayerDeath = false;
    this.showScoreboard = true;
}

Quest.prototype.serialize = function() {
    return {
        name: this.name,
        reward: this.reward,
        npcSpeechStart: this.npcSpeechStart,
        npcSpeechFinish: this.npcSpeechFinish,
        endsOnPlayerDeath: this.endsOnPlayerDeath,
        showScoreboard: this.showScoreboard,
        objectives: this.objectives.map(o => {
            return o.serialize();
        })
    };
}

Quest.deserialize = function(data) {
    var q = new Quest(data.name);
    q.reward = data.reward;
    q.npcSpeechStart = data.npcSpeechStart;
    q.npcSpeechFinish = data.npcSpeechFinish;
    q.endsOnPlayerDeath = data.endsOnPlayerDeath;
    q.showScoreboard = data.showScoreboard;
    q.objectives = data.objectives.map(o => {
        return QuestObjective.deserialize(o);
    });
    return q;
}

Quest.prototype.setReward = function(reward) {
    if (!(reward instanceof QuestReward)) throw new Error('Invalid reward'); 
    this.reward = reward;
}

Quest.prototype.addObj = function(obj) {
    if (!(obj instanceof QuestObjective)) throw new Error('Invalid objective');
    this.objectives.push(obj);
}

Quest.prototype.break = function(target, count, location) {
    var obj = new QuestObjective(QuestType.BREAK, target, this.objectives.length, count);
    this.objectives.push(obj);
    return this;
}

Quest.prototype.place = function(target, count, location = null) {
    var obj = new QuestObjective(QuestType.PLACE, target, this.objectives.length, count, location);
    this.objectives.push(obj);
    return this;
}

Quest.prototype.craft = function(target, count) {
    var obj = new QuestObjective(QuestType.CRAFT, target, this.objectives.length, count);
    this.objectives.push(obj);
    return this;
}

Quest.prototype.fish = function(count) {
    var obj = new QuestObjective(QuestType.FISH, null, this.objectives.length, count);
    this.objectives.push(obj);
    return this;
}

Quest.prototype.kill = function(target, count) {
    var obj = new QuestObjective(QuestType.KILL, target, this.objectives.length, count);
    this.objectives.push(obj);
    return this;
}

Quest.prototype.breed = function(target, count) {
    var obj = new QuestObjective(QuestType.BREED, target, this.objectives.length, count);
    this.objectives.push(obj);
    return this;
}

Quest.prototype.collect = function(target, count) {
    var obj = new QuestObjective(QuestType.COLLECT, target, this.objectives.length, count);
    this.objectives.push(obj);
    return this;
}

Quest.prototype.smelt = function(target, count) {
    var obj = new QuestObjective(QuestType.SMELT, target, this.objectives.length, count);
    this.objectives.push(obj);
    return this;
}

Quest.prototype.locate = function(target, count = 1) {
    var obj = new QuestObjective(QuestType.LOCATE, target, this.objectives.length, count);
    this.objectives.push(obj);
    return this;
}

exports.Quest = Quest;