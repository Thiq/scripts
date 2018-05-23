/**
 * bootstrap/core.js
 * ============
 * This file is in charge of loading the internal modules. After the loading of the core
 * files is complete, this file is also in charge of removing the internal modules from 
 * reference.
 */

var _require = require('internal/require');
var fs = require('internal/fs/index');
var path = require('internal/path/index');
var os = require('internal/os/index');
var _process = require('internal/process/core');
var assert = require('internal/assert');

var coreFiles = [
    'require',
    'lang',
    'safety',
    'promise',
    'events',
    'permissions',
    'commands',
    'tpm',
    'tts'
];

function initializeCore() {
    console.debug('Setting up internal environment.');
    for (var i = 0; i < coreFiles.length; i++) {
        require('internal/' + coreFiles[i]);
    }
    var entry = path.normalize('./plugins/Thiq/' + process.config.main);
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
}

initializeCore();