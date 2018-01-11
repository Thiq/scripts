import { QuestReward } from './rewards';
import { QuestObjective } from './objective';
import { QuestType } from './quest-actions';
import * as guid from 'guid';

export class Quest {
    name: string;
    id: string;
    objectives: QuestObjective[] = [];
    reward: QuestReward;
    npcSpeechStart: string[] = [];
    npcSpeechFinish: string[] = [];
    endsOnPlayerDeath: boolean = false;
    statuses: {};
    showScoreboard: boolean = true;

    constructor(name: string) {
        this.name = name;
        this.id = guid();
    }

    setReward(reward: QuestReward) {
        this.reward = reward;
    }

    break(target, count, location = null) {
        var obj = new QuestObjective(QuestType.BREAK, target, count);
        this.objectives.push(obj);
        return this;
    }

    place(target, count, location = null) {
        var obj = new QuestObjective(QuestType.PLACE, target, count, location);
        this.objectives.push(obj);
        return this;
    }

    craft(target, count) {
        var obj = new QuestObjective(QuestType.CRAFT, target, count);
        this.objectives.push(obj);
        return this;
    }
    
    fish(count) {
        var obj = new QuestObjective(QuestType.FISH, null, count);
        this.objectives.push(obj);
        return this;
    }

    kill(target, count) {
        var obj = new QuestObjective(QuestType.KILL, target, count);
        this.objectives.push(obj);
        return this;
    }

    breed(target, count) {
        var obj = new QuestObjective(QuestType.BREED, target, count);
        this.objectives.push(obj);
        return this;
    }

    collect(target, count) {
        var obj = new QuestObjective(QuestType.COLLECT, target, count);
        this.objectives.push(obj);
        return this;
    }

    smelt(target, count) {
        var obj = new QuestObjective(QuestType.SMELT, target, count);
        this.objectives.push(obj);
        return this;
    }

    locate(target, count = 1) {
        var obj = new QuestObjective(QuestType.LOCATE, target, 1);
        this.objectives.push(obj);
        return this;
    }
}