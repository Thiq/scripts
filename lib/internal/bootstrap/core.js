/**
 * bootstrap/core.js
 * ============
 * This file is in charge of loading the internal modules. After the loading of the core
 * files is complete, this file is also in charge of removing the internal modules from 
 * reference.
 */

var _process = require('internal/process/core');
var _require = global.require = require('modules');
var fs = require('fs');
var path = require('path');
var os = require('os');
var assert = require('assert');
var async = require('async');
var lang = require('lang');
var promise = require('promise');
var events = require('events');
var permissions = require('permissions');
var commands = require('commands');
var tts = require('internal/tts');
var tpm = require('tpm/index');

function initializeCore() {
    var entry = path.normalize(process.cwd() + process.config.main);
    console.debug('Environment setup completed. Running entry file ' + entry);
    var entryContents = fs.readFileSync(entry);
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