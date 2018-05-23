/**
 * bootstrap/core.js
 * ============
 * This file is in charge of loading the internal modules. After the loading of the core
 * files is complete, this file is also in charge of removing the internal modules from 
 * reference.
 */

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
    'commands',
    'permissions',
    'tpm',
    'tts'
];

function initializeCore() {
    console.debug('Initializing core.');
    for (var i = 0; i < coreFiles.length; i++) {
        require('internal/' + coreFiles[i]);
    }
    console.debug('Initialized core. Running entry files.');
}