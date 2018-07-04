var http = require("http");
var fs = require('fs');
var assert = require('assert');
var consts = require('constants');

registerCommand({
    name: 'fetch',
    description: 'Downloads and loads scripts from external sources such as pastebin or GitHub.',
    usage: '\xA7cUsage: /<command> <url> <filename>'
}, function(sender, label, args) {
    assert(sender.hasPermission('thiq.code.fetch'), consts.defaultPermissionMessage);
    var url = args[0];
    var filename = args[1];
    if (!url) {
        sender.sendMessage('Incorrect usage. Use /fetch <url> <filename>');
        return;
    }
    log('Fetching code from ' + url, 'd');
    http.get(url).then(function(result) {
        engine.eval(result);
        fs.writeFileSync('./plugins/Thiq/src/' + filename, result);
        log('Loaded ' + filename, 'd');
    }, function(err) {
        log('Failed to fetch code from ' + url + ': ' + err);
    });
});