var http = require('http');
var fs = require('fs');
var path = require('path');
var semver = require('semver');

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