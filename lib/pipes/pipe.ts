export class Pipe {
    position;
    type: PipeType;

    constructor(position, type) {
        this.position = position;
        this.type = type;
    }
}

export enum PipeType {
    STANDARD,
    RED,
    BLUE,
    GREEN
}