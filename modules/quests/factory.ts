/*
This file is responsible for allowing players to join, follow, finish, and leave quests.
It's in charge of tracking completion and data as well.
*/

import { Quest, QuestableNpc, QuestActions, QuestStatus, PlayerQuestStatus } from './types';

export class QuestFactory {
    existingQuests: Quest[] = [];
    activeQuests: QuestStatus[] = [];
    questHistory: PlayerQuestStatus[] = [];

    assignQuestToPlayer(questId: string, player) {
        let status = new QuestStatus(questId, player);
        this.activeQuests.push(status);
    }
}

// this is gonna be fun as shit. jk. I'm gonna probably kill myself.
// so lets create wrapper functions around the requirements that take a boolean
// as the result
function buildActionArray(quests: Quest[]): Function[] {
    let actionArray: Function[] = [];

    return actionArray;
}