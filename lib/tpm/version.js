var Command = require('tpm/command');

module.exports = new Command({
    name: 'version',
    help: 'Displays the version of the specified module',
    usage: '\xA7c/tpm version [module name]'
}, function(sender, label, args) {

});