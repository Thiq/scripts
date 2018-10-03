var Command = require('tpm/command');

module.exports = new Command({
    name: 'update',
    help: 'Updates all modules unless a specific module is supplied',
    usage: '\xA7c/tpm update <module name> <version>'
}, function(sender, label, args) {

});