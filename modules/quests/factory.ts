// take 2 at this whole shebang.
// the factory will manage all quests in progress for all players

import { Quest } from './quest';
import { QuestType } from './quest-actions';
import { QuestReward } from './rewards';
import { QuestObjective } from './objective';
import * as Scoreboard from 'scoreboard';
import * as _ from 'underscore';
import * as enderChest from 'ender-chest';
import * as pf from 'pf';
import { Title } from 'titles';

let C2 = Bukkit.getPluginManager().getPlugin('Citizens');
let npcRegistry = C2.getNPCRegistry();
let npcSpeech = C2.getSpeechFactory();

const completePrefix = '\xA7a✔';
const incompletePrefix = '\xA7c✘';
const table = enderChest.getTable('quests');

export { Quest as Quest };
export { QuestType as QuestType };
export { QuestReward as QuestReward };
export { QuestObjective as QuestObjective };

export class QuestFactory {
    /**
     * An object of { playerUUID: Quest }
     */
    registeredQuests = {};
    /**
     * An object of { playerUUID: QuestStatus }
     */
    activeQuests = {};
    /**
     * An object of { playerUUID: questUUID[] }
     */
    completedQuests = {};
    /**
     * An object of { npcID: questUUID[] }
     */
    registeredNpcs = {};

    constructor() {
        // we have to wait until Thiq is finished loading so that all scripts can finish adding
        // their quests.
        registerEvent(server, 'pluginEnabled', (e) => {
            if (e.getPlugin() == getPlugin()) {
                var players = Bukkit.getOnlinePlayers();
                for (let i = 0; i < players.length; i++) {
                    var player = players[i];
                    this.loadQuester(player);
                }
            }
        });
        
    }

    initializeHandlers() {
        registerEvent(player, 'intractEntity', (e) => {
            if (e.getRightClicked().class == org.bukkit.entity.LivingEntity.class) {
                let npc = npcRegistry.getNPC(e.getRightClicked());
                if (!npc) return;
                let foundEntity = this.registeredNpcs[npc.getUniqueId()];
                if (!foundEntity) return;
                if (this.activeQuests[e.getPlayer().getUniqueId()] != undefined) return;
                let playerCompleteStatus = this.completedQuests[e.getPlayer().getUniqueId()];
                // iterate through the NPCs tied quests to get the next one that hasn't been completed.
                let foundNextQuest = undefined;
                for (let i = 0; i < foundEntity.length; i++) {
                    var questName = foundEntity[i];
                    if (playerCompleteStatus.indexOf(questName) > -1) continue;
                    foundNextQuest = questName;
                }
                // if foundNextQuest == false, then the player has completed all quests with this NPC
                if (!foundNextQuest) return;
                this.addQuester(e.getPlayer(), foundNextQuest);
            }
        });
    }

    createNpc(type, name: string) {
        var npc = npcRegistry.createNpc(type, name);
        this.registeredNpcs[npc.getUniqueId().toString()] = [];
        return npc;
    }

    addQuest(quest: Quest) {
        if (this.registeredQuests[quest.name] != undefined) throw new Error('A quest with that ID already exists');
        this.registeredQuests[quest.name] = quest;
    }

    addQuester(player, questID) {
        if (!this.registeredQuests[questID]) throw new Error(`A quest with the ID ${questID} does not exist`);
        if (this.activeQuests[player.getUniqueId()] != undefined && 
            !this.activeQuests[player.getUniqueId()].isCompleted) {
            throw new Error('This player is already embarked on a quest');
        } else {
            this.activeQuests[player.getUniqueId()] = undefined;
        }
        this.activeQuests[player.getUniqueId()] = new QuestStatus(this, player.getUniqueId(), this.registeredQuests[questID]);
        let quest = this.registeredQuests[questID];
        let questTitle = new Title('New Quest:', quest.name)
                    .color('red')
                    .subColor('yellow')
                    .fadeIn(300)
                    .subFadeIn(1000)
                    .stay(1000)
                    .subStay(1000)
                    .fadeOut(1000)
                    .subFadeOut(1000);
                questTitle.send(player);
    }

    isQuesting(player) {
        return this.activeQuests[player.getUniqueId()] != undefined && 
        !this.activeQuests[player.getUniqueId()].isCompleted;
    }

    saveQuester(playerId) {
        // to save a quest point, we need:
        // - player UUID
        // - quest UUID
        // - an array of the current counts of objectives
        // Simple, yes?
        var status = this.activeQuests[playerId.toString()] as QuestStatus;
        if (!status || status.isComplete()) return false;
        var quest = this.registeredQuests[status.quest] as Quest;
        // create the current save point
        var savePoint = new QuestSavePoint(playerId.toString(), quest.name, status.objectives.map(e => {
            return e.currentCount;
        }));
        // persist the save point
        table.set(`qstr;${playerId}`, savePoint);
        // save completed quest line to the user profile
        var profile = pf.getProfile(playerId);
        profile.set('quests', 'completedQuests', this.completedQuests[playerId]);
        return savePoint;
    }

    loadQuester(player) {
        var playerId = player.getUniqueId();
        // load the completed quests from the profile
        var profile = pf.getProfile(playerId);
        var completedQuests = profile.get('quests', 'completedQuests');
        this.completedQuests[playerId] = completedQuests;
        // load the current quest
        var savePoint = table.get(`qstr;${playerId}`);
        if (!savePoint) return;
        var status = this.readQuestStatusFromSave(savePoint, player);
        this.activeQuests[playerId] = status;
        status.updateScoreboard();
    }

    private readQuestStatusFromSave(save: QuestSavePoint, player) {
        var quest = this.registeredQuests[save.questName];
        var status = new QuestStatus(this, player, quest);
        for (let i = 0; i < save.objStates.length; i++) {
            let objState = save.objStates[i];
            let objCurrent = status.objectives[i];
            objCurrent.setCurrentStatus(objState);
            status.updateObjStatus(objCurrent);
            objCurrent.beginWatch(player);
        }
        return status;
    }

    unloadQuester(playerId) {
        var savePoint = this.saveQuester(playerId);
        if (!savePoint) return;
        delete(this.activeQuests[playerId]);
        delete(this.completedQuests[playerId]);
    }
}

/**
 * Represents a save point of a quest.
 */
export class QuestSavePoint {
    playerUUID: string;
    questName: string;
    objStates: number[] = [];

    constructor(playerUUID: string, questName: string, objStates: number[]) {
        this.playerUUID = playerUUID;
        this.questName = questName;
        this.objStates = objStates;
    }
}

export class QuestStatus {
    player;
    objectives: QuestObjective[];
    scoreboard: Scoreboard;
    quest: string;
    isCompleted = {};
    factory: QuestFactory;

    constructor(factory: QuestFactory, player, quest: Quest) {
        this.factory = factory;
        this.player = player;
        this.objectives = quest.objectives.slice(0);
        this.scoreboard = new Scoreboard(`\xA7e${quest.name}`);
        this.quest = quest.name;
        for (let i = 0; i < this.objectives.length; i++) {
            let obj = this.objectives[i];
            let objText = `${QuestType[obj.type].toLowerCase()} ${obj.count} ${obj.target.toString().toLowerCase().replace('_', ' ')}`;
            let score = this.scoreboard.addEntry(
                `${incompletePrefix}${objText}`, 
                0,
                obj.id);
            obj.on('$progress', (sender, args) => {
                this.scoreboard.setEntry(obj.id, sender.currentCount);
            });
            obj.on('$completed', (sender, args) => {
                this.updateObjStatus(obj);
                this.isCompleted[sender.name] = true;
                if (this.isComplete()) {
                    this.factory.completedQuests[this.player.getUniqueId()].push(this.quest);
                }
            });
            obj.beginWatch(this.player);
            this.isCompleted[obj.id] = false;
        }
        if (quest.showScoreboard) this.scoreboard.send(this.player);
    }

    updateObjStatus(obj: QuestObjective) {
        let objText = `${QuestType[obj.type].toLowerCase()} ${obj.count} ${obj.target.toString().toLowerCase().replace('_', ' ')}`;
        if (obj.currentCount >= obj.count)
            this.scoreboard.setEntry(obj.id, obj.currentCount, `${completePrefix}${objText}`);
        else 
            this.scoreboard.setEntry(obj.id, obj.currentCount, `${incompletePrefix}${objText}`);
    }

    updateScoreboard() {
        for (let i = 0; i < this.objectives.length; i++) {
            let obj = this.objectives[i];
            this.scoreboard.setEntry(obj.id, obj.currentCount);
        }
    }

    isComplete() {
        for (let id in this.isCompleted) {
            if (!this.isCompleted[id]) return false;
        }
        return true;
    }

    destroy() {
        delete(this.objectives);
        delete(this.isCompleted);
        delete(this.scoreboard);
    }
}
