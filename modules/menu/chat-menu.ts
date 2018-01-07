import * as guid from 'guid';
import { IElement, HorizontalAlignment, VerticalAlignment } from './elements/element';

export class ChatMenu {
    // Public properties
    isInteractive: boolean = true;
    id: string;

    // Private properties

    constructor(isInteractive: boolean) {
        this.isInteractive = isInteractive;
        this.id = guid();
    }

    // Public methods


    // Private methods


    // Static methods
    static HorizontalAlignemnt: HorizontalAlignment;
    static VerticalAlignment: VerticalAlignment;
}