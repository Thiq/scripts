var http = require('http');
var fs = require('fs');
var types = require('util/types');
var _require = require('require');

var argsList = {
    'install': 'Installs a module',
    'uninstall': 'Removes a module',
    'update': 'Updates a module',
    'list': 'Lists installed modules',
    'ls': 'Lists installed modules',
    'version': 'Displays the current TPM version or the specified module version',
    'v': 'Displays the current TPM version or the specified module version',
}

var version = '1.0.0';
var methods = [];

var baseUrl = 'https://api.github.com/repos/thiq/node_modules/contents/';

var modulesDir = process.config.modules_dir;

function getAllModules() {
    return http.get(baseUrl);
}

registerCommand({
    name: 'tpm',
    description: 'Thiq Package Manager',
    usage: '\xA7e<command>'
}, function(sender, label, args) {
    assert(sender.hasPermission('tpm'), consts.defaultPermissionMessage);
    if (!args || args.length == 0) {
        sendCommands(sender);
        return;
    }
    var matchingCommand;
    for (var i = 0; i < methods.length; i++) {
        var method = methods[i];
        if (method.name == args[1]) {
            matchingCommand = method;
            break;
        } else if (method.aliases.indexOf(args[1]) > -1) {
            matchingCommand = method;
            break;
        }
    }
    
    if (matchingCommand) {
        sendCommands(sender);
    } else {
        var cmd = matchingCommand;
        cmd.callback(sender, args);
    }
});

function sendCommands(sender) {
    var response = '\n';
    for (var i = 0; i < methods.length; i++) {
        var method = methods[i];
        response += ('\xA7e' + method.name + '\xA7f: ' + method.description + '\n');
    }
    sender.sendMessage(response);
}

function TpmMethod(name, description, callback, aliases) {
    this.name = name;
    this.description = description;
    this.callback = callback;
    this.aliases = aliases || [];
}

methods.push(new TpmMethod(
    'version', 
    'Displays the current TPM version or the specified module version', 
    function(sender, args) {
        if (args.length == 1) {
            sender.sendMessage('TPM: \xA7b' + version);
        } else {
            var moduleName = args[1];
            if (!fs.exists(modulesDir + moduleName)) {
                sender.sendMessage('\xA7b' + modulesDir + moduleName + ' not found');
            } else {
                var packageJSON = modulesDir + moduleName + '/package.json';
                if (fs.exists(packageJSON)) {
                    var jsonContents = require(fs.readFile(modulesDir + moduleName + '/package.json'));
                    sender.sendMessage(moduleName + ': \xA7b' + jsonContents.version || '1.0.0');
                } else {
                    sender.sendMessage(moduleName + ': \xA7b1.0.0');
                }
            }
        }
}));

methods.push(new TpmMethod(
    'install', 
    'Installs a module', 
    function(sender, args) {
        assert(args.length > 1, '\xA7cCorrect usage: \xA7ftpm install [MODULE]');
        var moduleName = args[1].split('@')[0];
        var moduleVersion = args[1].split('@')[1];
        sender.sendMessage('\xA7eSpecifying versions is currently not supported. The latest version will be installed.');
        sender.sendMessage('\xA7eInstalling ' + moduleName + '...');
        if (fs.exists(modulesDir + moduleName)) {
                sender.sendMessage('\xA7c' + moduleName + ' is already installed. To update, call /tpm update ' + moduleName);
                return;
        }
        fs.mkdir(modulesDir + moduleName);
        http.get(baseUrl + moduleName).then(function(result) {
            for (var i = 0; i < result.length; i++) {
                var file = result[i];
                sender.sendMessage('\xA7eDownloading ' + file.path + '...');
                http.get(file.download_url).then(function(fileResult) {
                    fs.writeFile(modulesDir + file.path, fileResult);
                }, function(fileErr) {
                    sender.sendMessage(fileErr);
                });
            }
            sender.sendMessage('\xA7eFinished installing ' + moduleName);
        }, function(err) {
            sender.sendMessage('\xA7c' + moduleName + ' does not exist. For a list of available modules, check out https://github.com/thiq/node_modules');
        });
    }
));

methods.push(new TpmMethod(
    'uninstall',
    'Uninstalls a module',
    function(sender, args) {
        assert(args.length > 1, '\xA7cCorrect usage: \xA7ftpm uninstall [MODULE]');
        var moduleName = args[1];
        sender.sendMessage('\xA7eUninstalling ' + moduleName + '...');
        if (!fs.exists(modulesDir + moduleName)) {
            sender.sendMessage('\xA7c' + moduleName + ' is not installed');
        } else {
            if (fs.rmdir(modulesDir + moduleName))
                sender.sendMessage('\xA7eSuccessfully uninstalled ' + moduleName);
            else 
                sender.sendMessage('\xA7cFailed to delete directory');
        }
    }
));

methods.push(new TpmMethod(
    'list',
    'Lists all modules',
    function(sender, args) {
        var files = fs.readdir(modulesDir);
        var result = 'Found ' + files.length + ' installed modules:\n';
        for (var i = 0; i < files.length; i++) {
            result += '\xA7e' + files[i] + '\n';
        }
        sender.sendMessage(result);
    }
), [ 'ls' ]);