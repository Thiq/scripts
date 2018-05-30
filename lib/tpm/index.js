exports.init = init = require('tpm/init');
exports.install = install = require('tpm/install');
exports.ls = ls = require('tpm/ls');
exports.uninstall = uninstall = require('tpm/uninstall');
exports.update = update = require('tpm/update');
exports.version = version = require('tpm/version');

var repoUrl = 'https://api.github.com/repos/thiq/node_modules/contents/';

var modulesDir = process.config.modules_dir;

registerCommand({
    name: 'tpm',
    description: 'Commands for Thiq Package Manager',
    usage: '\xA7e<command>'
}, function (sender, label, args) {
    assert(sender.isOp(), consts.defaultPermissionMessage);
    if (!args || args.length == 0) {
        return false;
    }
});