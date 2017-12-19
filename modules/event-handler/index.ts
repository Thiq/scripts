export class EventHandler{
    registeredHandlers = [];

    constructor() {
        this.onRegister();
    }

    register(handler, name, event) {
        var cancellationToken = registerEvent(handler, name, function() {
            event.apply(self, arguments);
        })
        var registration = new EventRegistration(handler, name, cancellationToken);
        this.registeredHandlers.push(registration);
        return this;
    }

    finalize() {
        this.registeredHandlers.forEach((handler) => {
            handler.unregister();
        });
    }

    onRegister() {

    }
}

export class EventRegistration {
    handler;
    name;
    cancellationToken;

    constructor(handler, name, cancellationToken) {
        this.handler = handler;
        this.name = name;
        this.cancellationToken = cancellationToken;
    }

    unregister() {
        unregisterEvent(this.handler, this.name, this.cancellationToken);
    }
}
