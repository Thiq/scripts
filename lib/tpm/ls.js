var Command = require('tpm/command');

module.exports = new Command({
    name: 'ls',
    help: 'Lists all installed modules for the current server',
    usage: '\xA7c/tpm ls'
}, function(sender, label, args) {

});