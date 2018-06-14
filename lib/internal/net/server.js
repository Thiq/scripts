function Server(options, connectionListener) {
    EventEmitter.call(this);
    this.listening = false;
    this.maxConnections = 255; // TODO: see if this is too little or too much
    if (!options) options = { allowHalfOpen: false, pauseOnConnect: false };
    this._allowHalfOpen = options.allowHalfOpen || false;
    this._pauseOnConnect = options.pauseOnConnect || false;
}

Server.prototype.listen = function() {
    if (typeof arguments[0] === 'string') {
        // listen(path, backlog, callback)
    } else if (typeof arguments[0] === 'number') {
        // listen(port, host, backlog, callback)
    } else {
        // listen(options, callback)
    }

    this.listening = true;
    this.emit('listening');
}

Server.prototype.ref = function() {

}

Server.prototype.unref = function() {

}

module.exports = Server;