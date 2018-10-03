function TpmCommand(options, callback) {
    this.name = options.name;
    this.help = options.help;
    this.usage = options.usage;
    this.callback = callback;
    TpmCommand.registeredCommands.push(this);
}

TpmCommand.registeredCommands = [];

TpmCommand.findCommand = function(name) {
    for (var i = 0; i < TpmCommand.registeredCommands.length; ++i) {
        var cmd = TpmCommand.registeredCommands[i];
        if (cmd.name === name) return cmd;
    }
    return null;
}

module.exports = TpmCommand;