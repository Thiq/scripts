import * as EventHandler from 'event-handler';

class PlayerInput {

}

class InputCallbackEvent {
    player;
    message: string;
    cancelled: boolean = false;
    valid: boolean = true;
    invalidMessage: string;

    constructor(player, message, cancelled, valid, invalidMessage) {
        this.player = player;
        this.message = message;
        this.cancelled = cancelled;
        this.valid = valid;
        this.invalidMessage = invalidMessage;
    }
}