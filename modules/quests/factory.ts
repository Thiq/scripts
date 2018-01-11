// take 2 at this whole shebang.
// the factory will manage all quests in progress for all players

import { Quest } from './quest';
import { QuestType } from './quest-actions';
import { QuestReward } from './rewards';
import { QuestObjective } from './objective';
import * as Scoreboard from 'scoreboard';
import * as _ from 'underscore';
import * as enderChest from 'ender-chest';
import { Title } from 'titles';

let C2 = Bukkit.getPluginManager().getPlugin('Citizens');
let npcRegistry = C2.getNPCRegistry();
let npcSpeech = C2.getSpeechFactory();

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
     * An object of { playerUUID: questUUID }
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

    table = enderChest.getTable('quests');

    constructor() {
        
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
                    var questID = foundEntity[i];
                    if (playerCompleteStatus.indexOf(questID) > -1) continue;
                    foundNextQuest = questID;
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
        if (this.registeredQuests[quest.id] != undefined) throw new Error('A quest with that ID already exists');
        this.registeredQuests[quest.id] = quest;
    }

    addQuester(player, questID) {
        if (!this.registeredQuests[questID]) throw new Error('A quest with that ID does not exist');
        if (this.activeQuests[player.getUniqueId()] != undefined && 
            !this.activeQuests[player.getUniqueId()].isCompleted) {
            throw new Error('This player is already embarked on a quest');
        } else {
            this.activeQuests[player.getUniqueId()] = undefined;
        }
        this.activeQuests[player.getUniqueId()] = new QuestStatus(player.getUniqueId(), this.registeredQuests[questID]);
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

    saveQuester(playerID) {
        // to save a quest point, we need:
        // - player UUID
        // - quest UUID
        // - an array of the current counts of objectives
        // Simple, yes?
        var status = this.activeQuests[playerID] as QuestStatus;
        if (!status || status.isCompleted) return false;
        var savePoint = new QuestSavePoint(playerID, status.quest, status.objectives.map(e => {
            return e.currentCount;
        }));
        return savePoint;
    }

    loadQuester(save: QuestSavePoint) {
        var quest = 
        this.activeQuests[save.playerUUID]
    }
}

/**
 * Represents a save point of a quest.
 */
export class QuestSavePoint {
    playerUUID: string;
    questUUID: string;
    objStates: number[] = [];

    constructor(playerUUID: string, questUUID: string, objStates: number[]) {
        this.playerUUID = playerUUID;
        this.questUUID = questUUID;
        this.objStates = objStates;
    }
}


export class QuestStatus {
    player;
    objectives: QuestObjective[];
    scoreboard: Scoreboard;
    quest: string;
    isCompleted: boolean = false;

    constructor(playerUUID, quest: Quest) {
        this.player = Bukkit.getPlayer(playerUUID);
        this.objectives = quest.objectives.slice(0);
        this.scoreboard = new Scoreboard(`\xA7e${quest.name}`);
        this.quest = quest.id;
        for (let i = 0; i < this.objectives.length; i++) {
            let obj = this.objectives[i];
            this.scoreboard.addEntry(`${QuestType[obj.type].toLowerCase()} ${obj.count} ${obj.target.toString().toLowerCase().replace('_', ' ')}`);
            obj.on('$progress', (sender, args) => {
                this.scoreboard.setEntry(i, sender._currentCount);
            });
            obj.on('$completed', (sender, args) => {
                this.scoreboard.destroy();
                quest.reward.giveTo(this.player);
                for (let j = 0; j < quest.npcSpeechFinish.length; j++) {
                    this.player.sendMessage(quest.npcSpeechFinish[j]);
                }
                this.isCompleted = true;
            });
            obj.beginWatch(this.player);
        }
        if (quest.showScoreboard) this.scoreboard.send(this.player);
    }
}
