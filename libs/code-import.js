var http = require("http");
var fs = require('fs');

registerCommand({
    name: 'fetch',
    description: 'Downloads and loads scripts from external sources such as pastebin or GitHub.',
    usage: '\xA7cUsage: /<command> <url> <filename>',
    permission: registerPermission('thiq.code.fetch', 'op'),
    permissionMessage: '\xA7cYou do not have sufficient permissions to use that.'
}, function(sender, label, args) {
    var url = args[0];
    var filename = args[1];
    if (!url) {
        sender.sendMessage('Incorrect usage. Use /fetch <url> <filename>');
        return;
    }
    log('Fetching code from ' + url, 'd');
    http.get(url).then(function(result) {
        engine.eval(result);
        fs.writeFileSync('./plugins/Thiq/libs/' + filename, result);
        log('Loaded ' + filename, 'd');
    }, function(err) {
        log('Failed to fetch code from ' + url + ': ' + err);
    });
});