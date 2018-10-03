var Command = require('tpm/command');
var assert = require('assert');
var tpmUtils = require('tpm/utils');
var consts = require('constants');

exports.init = init = require('tpm/init');
exports.install = install = require('tpm/install');
exports.ls = ls = require('tpm/ls');
exports.uninstall = uninstall = require('tpm/uninstall');
exports.update = update = require('tpm/update');
exports.version = version = require('tpm/version');

var repoUrl = tpmUtils.repoUrl;
var registeredCommands = Command.registeredCommands;

var modulesDir = process.config.modules_dir;

registerCommand({
    name: 'tpm',
    description: 'Commands for Thiq Package Manager',
    usage: '\xA7e/<command> ' + registeredCommands.map(function(c) { return c.name })
}, function (sender, label, args) {
    assert(sender.isOp(), consts.defaultPermissionMessage);
    if (!args || args.length === 0) {
        return false;
    }
    var cmd = Command.findCommand(args[0]);
    if (!cmd) return false;
    if (!cmd.callback) {
        sender.sendMessage('This command is currenly not implemented');
        return;
    }
    return cmd.callback(sender, label, args);
});