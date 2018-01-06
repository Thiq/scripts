import * as guid from 'guid';

export abstract class IElement {
    id: string;
    text: string;
    horizontalAlignment: HorizontalAlignment = HorizontalAlignment.INHERIT;
    verticalAlignment: VerticalAlignment = VerticalAlignment.INHERIT;
    left: number = 0;
    right: number = 0;
    top: number = 0;
    bottom: number = 0;

    constructor(text: string) {
        this.id = guid();
    }

    abstract onClick(p);
}

export enum HorizontalAlignment {
    LEFT,
    CENTER,
    RIGHT,
    INHERIT
}

export enum VerticalAlignment {
    TOP,
    MIDDLE,
    BOTTOM,
    INHERIT
}