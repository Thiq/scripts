var EventEmitter = require('events');
var util = require('util');
var internalUtil = require('internal/util');
var inet = require('internal/net');
var isIP = inet.isIP;
var isIPv4 = inet.isIPv4;
var isIPv6 = inet.isIPv6;
var isLegalPort = inet.isLegalPort;
var normalizedArgsSymbol = inet.normalizedArgsSymbol;
var makeSyncWrite = inet.makeSyncWrite;

function Server(options, connectionListener) {
    EventEmitter.call(this);
    this.listening = false;
    this.maxConnections = 255; // TODO: see if this is too little or too much
}

Server.prototype.listen = function() {
    if (typeof arguments[0] === 'string') {
        // listen(path,)
    }
}