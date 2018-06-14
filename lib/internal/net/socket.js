function Socket(options) {
    EventEmitter.call(this);
    if (!options) {
        options = {
            allowHalfOpen: false,
            readable: false,
            writable: false
        };
    }
    this.bufferSize = buffer.kMaxLength;
    this.bytesRead = 0;
    this.bytesWritten = 0;
    this.connecting = false;
    this.destroyed = false;
    this.localAddress = undefined; // TODO:
    this.localPort = undefined; // TODO:
    this.remoteAddress = undefined; // TODO:
    this.remoteFamily = undefined; // TODO:
    this.remotePort = undefined; // TODO:
    this._encoding = 'buffer';

    this._fd = options.fd;
    this._allowHalfOpen = options.allowHalfOpen;
    this._readable = options.readable;
    this._writable = options.writable;
}

Socket.prototype.connect = function() {
    this.connecting = true;
    if (typeof arguments[0] === 'string') {
        // connect(path, connectListener)
    } else if (typeof arguments[0] === 'number') {
        // connect(port, host, connectListener)
    } else {
        // connect(options, connectListener)
    }
    this.connecting = false;
    this.emit('connect');
}

Socket.prototype.destroy = function(exception) {
    // TODO:
    this.destroyed = false;
}

Socket.prototype.end = function(data, encoding) {
    this.emit('end', data, encoding);
}

Socket.prototype.pause = function() {

}

Socket.prototype.ref = function() {

}

Socket.prototype.unref = function() {

}

Socket.prototype.resume = function() {

}

Socket.prototype.setEncoding = function(encoding) {
    this._encoding = encoding; // TODO: checks
}

Socket.prototype.setKeepAlive = function(enable, initialDelay) {

}

Socket.prototype.setNoDelay = function(noDelay) {

}

Socket.prototype.setTimeout = function(timeout, callback) {

}

Socket.prototype.write = function(data, encoding, callback) {

}

module.exports = Socket;