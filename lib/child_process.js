var ProcessBuilder = require('@java.lang.ProcessBuilder');
var Redirect = ProcessBuilder.Redirect;
var async = require('async');
var EventEmitter = require('events');
var internalUtil = require('internal/util');
var path = require('path');

var workingDirectory = new java.io.File(path.normalize('./plugins/Thiq'));

function ChildProcess(processBuilder, stdio) {
    EventEmitter.call(this);
    this._process = processBuilder.start();
    this.killed = false;
    this.connected = true;
    this.stdio = stdio;
    this.stderr = this._process.getErrorStream();
    this.stdin = this._process.getInputStream();
    this.stdout = this._process.getOutputStream();
}

ChildProcess.prototype.send = function(message, options, callback) {
    var is = this._process.getOutputStream();
    is.write(message.toString());
    is.flush();
}

ChildProcess.prototype.kill = function(signal) {
    this._process.destroy();
    this.killed = true;
    this.emit('exit');
}

function spawn(command, args, options) {
    var pbArgs = [command];
    for (var i = 0; i < args.length; ++i) {
        pbArgs.push(args[i]);
    }

    var processBuilder = new ProcessBuilder(pbArgs);
    options = options || { 
        detached: false,
        stdio: ['pipe', 'pipe', 'pipe']
    };
    if (typeof options.stdio === 'string') {
        options.stdio = internalUtil.createArrayFromString(options.stdio, 3);
    }
    if (options.stdio[0] === process.stdin || options.stdio[0] === 0) options.stdio[0] = 'inherit';
    if (options.stdio[1] === process.stdout || options.stdio[0] === 1) options.stdio[1] = 'inherit';
    if (options.stdio[2] === process.stderr || options.stdio[0] === 2) options.stdio[2] = 'inherit';
    var stdin = getRedirectFromString(options.stdio[0]);
    var stdout = getRedirectFromString(options.stdio[1]);
    var stderr = getRedirectFromString(options.stdio[2]);

    if (stdin) processBuilder.redirectInput(stdin);
    if (stdout) processBuilder.redirectOutput(stdout);
    if (stderr) processBuilder.redirectError(stderr);

    processBuilder.redirectErrorStream(true);
    processBuilder.directory(workingDirectory);

    return new ChildProcess(processBuilder, options.stdio);
}

function getRedirectFromString(input) {
    switch(input) {
        case 'pipe': return Redirect.PIPE;
        case 'inherit': return Redirect.INHERIT;
        case 'ignore': return false;
        default: return false;
    }
}

module.exports = {
    spawn
}