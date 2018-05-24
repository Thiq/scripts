exports.init = init = require('./init');
exports.install = install = require('./install');
exports.ls = ls = require('./ls');
exports.uninstall = uninstall = require('./uninstall');
exports.update = update = require('./update');
exports.version = version = require('./version');

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