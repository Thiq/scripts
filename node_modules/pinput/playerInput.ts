const { EventHandler } = require('event-handler');

class InputCallbackEvent {
    player;
    message;
    cancelled = false;
    valid = true;
    invalidMessage;

    constructor(player, message, cancelled = false, valid = true, invalidMessage = '') {
        this.player = player;
        this.message = message;
        this.cancelled = cancelled;
        this.valid = valid;
        this.invalidMessage = invalidMessage;
    }
}

export class ChatbarSession extends EventHandler {
    player;
    message;
    callback;

    constructor(player, message, callback) {
        player.sendMessage(`\xA7e${message}`);
        player.sendMessage('\xA7eType /cancel to escape');
        super();
        this.player = player;
        this.message = message;
        this.callback = callback;
    }

    onRegister() {
        this.register(this.player, 'chat', this.onChat);
        this.register(this.player, 'command', this.onCommand);
    }

    onChat(event) {
        var message = _s(event.message);
        event.cancelled = true;
        var callback = new InputCallbackEvent(this.player, message);
        this.callback(callback);
        if (!callback.valid) {
            event.player.sendMessage(callback.invalidMessage);
            return;
        }
        this.finalize();
    }

    onCommand(event) {
        var message = _s(event.message);
        if (event.player.getUniqueId() != this.player.getUniqueId()) return;
        if (/^\/cancel\b/i.test(message)) return;
        event.cancelled = true;
        var callback = new InputCallbackEvent(this.player, '', true);
        this.callback(callback);
        this.finalize();
    }
}

export class BookSession extends EventHandler {
    player;
    message;
    callback;

    constructor(player, message, callback) {
        player.sendMessage(`\xA7e${message}`);
        player.sendMessage('\xA7eType /cancel to escape');
        super();
        this.player = player;
        this.message = message;
        this.callback = callback;
    }
}

export function awaitChatMessage(player, message, finished, validCallback) {
    var chat = new ChatbarSession(player, message, (e) => {
        if (e.cancelled) {
            player.sendMessage('\xA7eCancelled');
        } else {
            player.sendMessage(`\xA77>> ${e.message}`);
            validCallback(e);
        }
        if (e.valid) finished(event);
    });
}