const _ = require('underscore');
const enderChest = require('ender-chest');

const table = enderChest.getTable('quests');
table.set('npcs', table.get('npcs') || []);

function getNPCRegistry() {
    return getPlugin('Citizens').getNPCRegistry();
}

function getNPCSpeech() {
    return getPlugin('Citizens').getSpeechFactory();
}

function NPCFactory(factory) {
    this._registeredNPCs = [];
    this._factory = factory;
    var npcs = table.get('npcs') || [];
    for (var i = 0; i < npcs.length; i++) {
        var npc = npcs[i];
        this._registeredNPCs.push(npc);
    }
    console.log(`Loaded ${npcs.length} quest NPCs.`, 'd');
    eventHandler('player', 'interactEntity', (e) => {
        let player = e.player;
        let npc = getNPCRegistry().getNPC(e.getRightClicked());
        if (!npc) return;
        let questNPC = this.getNPCByUUID(npc.getUniqueId());
        if (!questNPC) return;
        e.cancelled = true;

        if (this._factory.isQuesting(player)) return;
        if (!this._factory.canPlayerQuest(player)) {
            player.sendMessage("\xA7cYou don't have access to quests!");
            return;
        }
        let nextQuest = null;
        for (var i = 0; i < questNPC.quests.length; i++) {
            let quest = questNPC.quests[i];
            if (this._factory.hasPlayerCompleted(player, quest)) continue;
            nextQuest = quest;
            break;
        }
        if (!nextQuest) return;
        this.activateQuest(player, npc, nextQuest);
        this._factory.addQuester(player, nextQuest);
    });
}

NPCFactory.prototype.activateQuest = function(player, npc, questName) {
    // let NPC talk and ask questions
}

NPCFactory.prototype.hasNPC = function(name) {
    return _.any(this._registeredNPCs, { name: name });
}

NPCFactory.prototype.getNPCByUUID = function(uuid) {
    return _.find(this._registeredNPCs, (npc) => {
        return npc.uniqueID == uuid.toString();
    });
}

NPCFactory.prototype.getNPC = function(entity) {
    var npc = getNPCRegistry().getNPC(entity);
    return _.where(this._registeredNPCs, { uniqueID: npc.getUniqueId().toString() })[0];
}

NPCFactory.prototype.createNPC = function(name, location, quests, type) {
    if (!quests) quests = [];
    if (!type) type = org.bukkit.entity.EntityType.PLAYER;
    let npc = getNPCRegistry().createNPC(type, name);
    let questNPC = new QuestNPC(name, npc.getUniqueId(), type);
    this._registeredNPCs.push(questNPC);
    if (quests) {
        quests.forEach((quest) => {
            questNPC.addQuest(quest);
        });
    }
    npc.spawn(location);
    return questNPC;
}

NPCFactory.prototype.removeNPC = function(entity) {
    let npc = getNPCRegistry().getNPC(entity);
    if (!npc) throw new Error('Entity is not an NPC');
    for (var i = 0; i < this._registeredNPCs.length; i++) {
        var rn = this._registeredNPCs[i];
        if (rn.uniqueID == npc.getUniqueId()) {
            this._registeredNPCs.splice(i, 1);
            break;
        }
    }
}

exports.NPCFactory = NPCFactory;

function QuestNPC(name, uniqueID, type) {
    this.name = name;
    this.uniqueID = uniqueID.toString();
    this.type = type;
    this.quests = [];
    table.get('npcs').push(this);
    table.save();
}

QuestNPC.prototype.addQuest = function(questID) {
    this.quests.push(questID);
}

QuestNPC.prototype.hasQuest = function(questID) {
    return this.quests.indexOf(questID) > -1;
}

QuestNPC.prototype.removeQuest = function(questID) {
    this.quests.splice(this.quests.indexOf(questID));
}

QuestNPC.prototype.getCitizen = function() {
    return getNPCRegistry().getByUniqueId(this.uniqueID);
}

exports.QuestNPC = QuestNPC;