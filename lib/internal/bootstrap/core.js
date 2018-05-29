/**
 * bootstrap/core.js
 * ============
 * This file is in charge of loading the internal modules. After the loading of the core
 * files is complete, this file is also in charge of removing the internal modules from 
 * reference.
 */

var _process = require('internal/process/core');
var _require = require('internal/require');
var fs = require('internal/fs/index');
var path = require('internal/path/index');
var os = require('internal/os/index');
var assert = require('internal/assert');
var async = require('internal/async');
var lang = require('internal/lang');
var safety = require('internal/safety');
var promise = require('internal/promise');
var events = require('internal/events');
var permissions = require('internal/permissions');
var commands = require('internal/commands');
var tts = require('internal/tts');

function initializeCore() {
    var entry = path.normalize('./plugins/Thiq/' + process.config.main);
    try {
        _require('tpm');
    } catch (ex) {
        console.error("tpm is not installed. To install, follow the directions at https://github.com/thiq/node_modules/tpm");
        console.error("Without tpm, you will not be able to install or validate your packages.");
    }
    console.debug('Environment setup completed. Running entry file ' + entry);
    var entryContents = fs.readFile(entry);
    var wrapped = '(function (require, __filename) {' + entryContents + '\n})';
    var compiled = eval(wrapped);
    var args = [
        function(request) {
            return _require(request, { filename: entry, id: 'entry' });
        },
        entry
    ]
    compiled.apply(null, args);
    global.require = function(request) {
        return _require(request, { filename: process.cwd() + 'repl.js', id: 'repl' }, true);
    }
}

initializeCore();