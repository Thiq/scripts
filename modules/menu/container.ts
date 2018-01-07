import { IElement } from './elements/element';

export default class Container {
    protected id: string;
    protected elements: IElement[] = [];
}