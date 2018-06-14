/**
 * bootstrap/core.js
 * ============
 * This file is in charge of loading the internal modules. After the loading of the core
 * files is complete, this file is also in charge of removing the internal modules from 
 * reference.
 */

var _process = require('internal/process/core');
var _require = global.require = require('modules');
var errors = require('errors');
var path = require('path');
var fs = require('fs');
var commands = require('commands');
var permissions = require('permissions');
var events = require('events');
var lang = require('lang');

function initializeCore() {
    if (!process.config.main) {
        throw new errors.ERR_INVALID_RETURN_VALUE('process.config["main"]', process.config.main, 'package.main must set an entry point');
    }
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