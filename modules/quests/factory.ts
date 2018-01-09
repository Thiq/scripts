/*
This file is responsible for allowing players to join, follow, finish, and leave quests.
It's in charge of tracking completion and data as well.
*/

import { Quest, QuestableNpc, QuestAction, QuestActions, QuestStatus, PlayerQuestStatus } from './types';
import * as Scoreboard from 'scoreboard';
import * as guid from 'guid';

export class QuestFactory {
    static quests: QuestContainer[] = [];

    static assignQuest(player, quest: Quest) {
        for (var i = 0; i < this.quests.length; i++) {
            if (!this.quests[i]) continue;
            if (this.quests[i].player.getUniqueId() == player.getUniqueId()) {
                this.quests[i].destroy();
                this.quests.splice(i, 1);
            }
        }
        this.quests.push(new QuestContainer(quest, player));
    }
}

function normalizeItemName(material) {
    return material.toString().replace('_', ' ').toLowerCase();
}

/* fuck this is gonna suck. Ok, here it goes:
When the quest is assigned, it'll create an event handler for the player. Once that QuestAction is complete,
it'll then create another for the next, so on so forth until the quest is complete. Once it is, it'll call reward() 
and register a handler to talk to the NPC that assigned the quest.
*/

class QuestContainer {
    currentInc: number = 0;
    quest: Quest;
    questWatchers: QuestActionWatcher[] = [];
    player;
    id: string;
    scoreboard: Scoreboard;

    constructor(quest: Quest, player) {
        this.player = player;
        this.quest = quest;
        this.id = guid();
        this.scoreboard = new Scoreboard('\xA7e' + quest.name);
        for (let i = 0; i < quest._actions.length; i++) {
            var action = quest._actions[i];
            this.scoreboard.addEntry(QuestActions[action.action].toLowerCase() + ' ' + action.count + ' ' + normalizeItemName(action.target));
        }
        this.scoreboard.send(player);
        this.questWatchers = quest._actions.map((s) => new QuestActionWatcher(player, s, 
        () => {
            this.currentInc++;
            if (this.currentInc <= this.quest._actions.length)
                this.beginWatch(this.getCurrentObjective());
        },
        (value) => {
            this.scoreboard().setEntry(this.currentInc, value);
        }));
        this.beginWatch(this.questWatchers[0]);
    }

    getCurrentObjective(): QuestActionWatcher {
        return this.questWatchers[this.currentInc];
    }

    getNextObjective(): QuestActionWatcher {
        return this.questWatchers[this.currentInc + 1];
    }

    isComplete() {
        return this.currentInc > this.questWatchers.length;
    }

    beginWatch(watcher: QuestActionWatcher) {
        switch (watcher.questAction.action) {
            case QuestActions.BREAK:
                watcher.watchBreak();
                break;
            case QuestActions.BREED:
                watcher.watchBreed();
                break;
            case QuestActions.COLLECT:
                watcher.watchCollect();
                break;
            case QuestActions.CRAFT:
                watcher.watchCraft();
                break;
            case QuestActions.FISH:
                watcher.watchFish();
                break;
            case QuestActions.GROW:
                watcher.watchGrow();
                break;
            case QuestActions.KILL:
                watcher.watchKill();
                break;
            case QuestActions.LOCATE:
                watcher.watchLocate();
                break;
            case QuestActions.PLACE:
                watcher.watchPlace();
                break;
            case QuestActions.SMELT:
                watcher.watchSmelt();
                break;
        }
    }

    destroy() {
        this.questWatchers[this.currentInc].destroy();
        this.questWatchers = [];
        this.scoreboard.destroy();
    }
}

/**
 * A wrapper around an individual objective of a quest.
 */
class QuestActionWatcher {
    cancelToken = null;
    count: number = 0;
    questAction: QuestAction;
    player;
    watchComplete: Function;
    increment: Function;

    constructor(player, questAction: QuestAction, watchComplete?: Function, increment?: Function) {
        this.player = player;
        this.questAction = questAction;
        this.watchComplete = watchComplete;
        this.increment = increment;
    }

    watchBreak() {
        this.cancelToken = registerEvent(block, 'bbreak', (e) => {
            if (this.player.getUniqueId() != e.getPlayer().getUniqueId()) return;
            if (e.getBlock().type == this.questAction.target) this.count++; 
            if (e.getBlock().type == this.questAction.target.type) this.count++;
            if (this.count >= this.questAction.count) {
                unregisterEvent(this.cancelToken);
            }
        });
    }

    watchPlace() {
        throw new Error('watchPlace is not implemented');
    }

    watchCraft() {
        this.cancelToken = registerEvent(inventory, 'craft', (e) => {
            if (e.getViewers()[0].getUniqueId() != this.player.getUniqueId()) return;
            var result = e.getInventory().getResult();
            if (result.type == this.questAction.target) {
                this.count++;
                this.onIncrement();
            }
            if (result.type == this.questAction.target.type) {
                this.count++;
                this.onIncrement();
            }
            if (this.count >= this.questAction.count) {
                unregisterEvent(this.cancelToken);
            }
        });
    }

    watchGrow() {
        throw new Error('watchGrow is not implemented');
    }

    watchFish() {
        this.cancelToken = registerEvent(player, 'fish', (e) => {
            if (e.getPlayer().getUniqueId() != this.player.getUniqueId()) return;
            this.count++;
            this.onIncrement();
            if (this.count >= this.questAction.count) {
                unregisterEvent(this.cancelToken);
            }
        });
    }

    watchKill() {
        this.cancelToken = registerEvent(entity, 'death', (e) => {
            if (e.getEntity().getKiller() == null || e.getEntity().getKiller().getUniqueId() != this.player.getUniqueId()) return;
            if (e.getEntityType() == this.questAction.target) {
                this.count++;
                this.onIncrement();
            }
            
            if (this.count >= this.questAction.count) {
                unregisterEvent(this.cancelToken);
            }
        });
    }

    watchBreed() {
        this.cancelToken = registerEvent(entity, 'breed', (e) => {
            if (e.getBreeder().getUniqueId == undefined || e.getBreeder().getUniqueId() != this.player.getUniqueId()) return;
            if (e.getEntityType() == org.bukkit.entity.EntityType.valueOf(this.questAction.target)) {
                this.count++;
                this.onIncrement();
            }
            if (e.getEntityType() == this.questAction.target) {
                this.count++;
                this.onIncrement();
            }
            if (this.count >= this.questAction.count) {
                unregisterEvent(this.cancelToken);
            }
        });
    }

    watchCollect() {
        this.cancelToken = registerEvent(inventory, 'pickupItem', (e) => {
            if (this.player.getInventory().contains(this.questAction.target, this.questAction.count)) {
                if (this.count >= this.questAction.count) {
                    unregisterEvent(this.cancelToken);
                    this.onIncrement();
                }
            }
        });
    }

    watchSmelt() {
        this.cancelToken = registerEvent(inventory, 'extract', (e) => {
            if (e.getItemType() == this.questAction.target) {
                this.count += e.getItemAmount();
                this.onIncrement();
            }
            if (this.count >= this.questAction.count) {
                unregisterEvent(this.cancelToken);
            }
        });
    }

    watchLocate() {
        this.cancelToken = registerEvent(player, 'move', (e) => {
            // this one is dangerous, so lets make it as lightweight as possible
            if (e.getTo().distanceSquared(this.questAction.target) < 10) unregisterEvent(this.cancelToken);
        })
    }

    onWatchComplete() {
        this.watchComplete(this.player, this.questAction);
    }

    onIncrement() {
        this.increment(this.count);
    }

    destroy() {
        unregisterEvent(this.cancelToken);
    }
}