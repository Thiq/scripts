exports.createHmac = function(generator, secret) {
    return new Hmac(generator, secret);
}

function Hmac(generator, secret) {
    this.generator = generator;
    this.secret = secret;
    this.$handlers = {
        readable: []
    }
}

Hmac.prototype.on = function(event, handler) {
    if (!this.$handlers[event]) throw new Error('HMAC does not raise event ' + event);
    this.$handlers[event].push(handler);
}

Hmac.prototype.$raise = function(event) {
    if (!this.$handlers[event]) throw new Error('HMAC does not have a handler for event ' + event);
    var handlers = this.$handlers[event];
    for (var i = 0; i < handlers.length; i++) {
        handlers[i]();
    }
}

Hmac.prototype.digest = function(encoding) {

}

Hmac.prototype.update = function(data, inputEncoding) {

}