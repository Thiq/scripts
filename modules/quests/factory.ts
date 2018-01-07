/*
This file is responsible for allowing players to join, follow, finish, and leave quests.
It's in charge of tracking completion and data as well.
*/

import { Quest, QuestableNpc, QuestAction, QuestActions, QuestStatus, PlayerQuestStatus } from './types';

export class QuestFactory {
    existingQuests: Quest[] = [];
    activeQuests: QuestStatus[] = [];
    questHistory: PlayerQuestStatus[] = [];

    assignQuestToPlayer(questId: string, player) {
        let status = new QuestStatus(questId, player);
        this.activeQuests.push(status);
    }
}

/* fuck this is gonna suck. Ok, here it goes:
When the quest is assigned, it'll create an event handler for the player. Once that QuestAction is complete,
it'll then create another for the next, so on so forth until the quest is complete. Once it is, it'll call reward() 
and register a handler to talk to the NPC that assigned the quest.
*/

function assignQuest(player, quest: Quest) {

}

class EventTarget {
    target;
    property: string;
    constructor(target?, property?: string) {
        this.target = target;
        this.property = property;
    }
}

function getActionEventTarget(action: QuestActions): EventTarget {
    switch(action) {
        case QuestActions.BREAK:
            return new EventTarget(block, 'bbreak');
        case QuestActions.PLACE:
            return new EventTarget(block, 'place');
        case QuestActions.CRAFT:
            return new EventTarget(inventory, 'craft');
        case QuestActions.GROW:
            return new EventTarget(block, 'grow');
        case QuestActions.FISH:
            return new EventTarget(player, 'fish');
        case QuestActions.KILL:
            return new EventTarget(entity, 'death');
        case QuestActions.BREED:
            return new EventTarget(entity, 'breed');
        case QuestActions.COLLECT:
            return new EventTarget(inventory, 'pickupItem');
        case QuestActions.SMELT:
            return new EventTarget(inventory, 'smelt');
        case QuestActions.LOCATE:
            return new EventTarget(player, 'move');
    }
}

class QuestActionWatcher {
    cancelToken = null;
    count: number = 0;
    questAction: QuestAction;
    player;
    watchComplete: Function;

    constructor(player, questAction: QuestAction, watchComplete?: Function) {
        this.player = player;
        this.questAction = questAction;
        this.watchComplete = watchComplete;
    }

    watchBreak() {
        this.cancelToken = registerEvent(block, 'bbreak', (e) => {
            if (this.player.getUniqueId() != e.getPlayer().getUniqueId()) return;
            if (e.getBlock().type == this.questAction.target) this.count++; 
            if (e.getBlock().type == this.questAction.target.type && e.getBlock().) this.count++;
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
            if (result.type == this.questAction.target) this.count++;
            if (result.type == this.questAction.target.type) this.count++;
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
            if (this.count >= this.questAction.count) {
                unregisterEvent(this.cancelToken);
            }
        });
    }

    watchKill() {
        this.cancelToken = registerEvent(entity, 'damageByEntity', (e) => {
            if (e.getDamager().getUniqueId == undefined || e.getDamager().getUniqueId() != this.player.getUniqueId()) return;
            if (e.getEntityType() == this.questAction.target && e.getEntity().getHealth() <= 0) this.count++;
            if (e.getEntityType() == org.bukkit.entity.EntityType.valueOf(this.questAction.target) && e.getEntity().getHealth() <= 0) this.count++;
            if (this.count >= this.questAction.count) {
                unregisterEvent(this.cancelToken);
            }
        });
    }

    watchBreed() {
        registerEvent(entity, 'breed', (e) => {
            if (e.getBreeder().getUniqueId == undefined || e.getBreeder().getUniqueId() != this.player.getUniqueId()) return;
            if (e.getEntityType() == org.bukkit.entity.EntityType.valueOf(this.questAction.target)) this.count++;
            if (e.getEntityType() == this.questAction.target) this.count++;
            if (this.count >= this.questAction.count) {
                unregisterEvent(this.cancelToken);
            }
        });
    }

    watchCollect() {
        registerEvent(inventory, 'pickupItem', (e) => {
            if (this.player.getInventory().contains(this.questAction.target, this.questAction.count)) {
                if (this.count >= this.questAction.count) {
                    unregisterEvent(this.cancelToken);
                }
            }
        });
    }

    watchSmelt() {
        registerEvent(inventory, 'extract', (e) => {
            if (e.getItemType() == this.questAction.target) this.count += e.getItemAmount();
            if (this.count >= this.questAction.count) {
                unregisterEvent(this.cancelToken);
            }
        });
    }

    watchLocate() {
        registerEvent(player, 'move', (e) => {
            // this one is dangerous, so lets make it as lightweight as possible
            if (e.getTo().distanceSquared(this.questAction.target) < 10) unregisterEvent(this.cancelToken);
        })
    }

    onWatchComplete() {
        this.watchComplete(this.player, this.questAction);
    }
}