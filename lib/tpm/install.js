var http = require('http');
var fs = require('fs');
var path = require('path');
var semver = require('semver');
var Command = require('tpm/command');

function checkIfNativeModule(id) {
    return NativeModule.getCached(id);
}

function checkIfModuleExists(id) {
    return fs.exists(process.config.modules_dir + id);
}

function isInstalledVersionHigher(id, version) {
    var installed = require.Module.fromCache(id);
    if (!installed) return false;
    return semver.gtr(install.config.version, version);
}

function getVersionToInstall(request) {
    var version = request.split('@')[1];
    return !version || version == 'latest' ? true : version;
}

module.exports = new Command({
    name: 'install',
    help: 'Installs a specified module',
    usage: '\xA7c/tpm install [module name]'
}, function(sender, label, args) {

});