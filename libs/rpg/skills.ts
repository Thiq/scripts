export enum Skills {

}

export class SkillStatus {
	level: number;
	xp: number;
	skill: Skills; // we use this to match with a skills object.
}

class SkillObject {
	skill: Skills;
	name: string;
	description: string;
	maxLevel: number = 100;
	startingLevel: number = 0;
}