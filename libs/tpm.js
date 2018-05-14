const http = require('http');
const fs = require('fs');
const _ = require('underscore');

const argsList = {
    'install': 'Installs a module',
    'uninstall': 'Removes a module',
    'update': 'Updates a module',
    'list': 'Lists installed modules',
    'ls': 'Lists installed modules',
    'version': 'Displays the current TPM version or the specified module version',
    'v': 'Displays the current TPM version or the specified module version',
}

const version = '1.0.0';
const methods = [];

const baseUrl = 'https://api.github.com/repos/thiq/node_modules/contents/';

let modulesDir = libraryConfig.objects.modulesDir;

function getAllModules() {
    return http.get(baseUrl);
}

registerCommand({
    name: 'tpm',
    description: 'Thiq Package Manager',
    usage: '\xA7e<command>'
}, (sender, label, args) => {
    assert(sender.hasPermission('tpm'), consts.defaultPermissionMessage);
    if (!args || args.length == 0) {
        sendCommands(sender);
        return;
    }
    let matchingCommands = _.where(methods, { name: args[0] });
    if (matchingCommands.length == 0) {
        sendCommands(sender);
    } else {
        var cmd = matchingCommands[0];
        cmd.callback(sender, args);
    }
});

function sendCommands(sender) {
    var response = '\n';
    for (var i = 0; i < methods.length; i++) {
        var method = methods[i];
        response += (`\xA7e${method.name}\xA7f: ${method.description}\n`);
    }
    sender.sendMessage(response);
}

function TpmMethod(name, description, callback) {
    this.name = name;
    this.description = description;
    this.callback = callback;
}

methods.push(new TpmMethod(
    'version', 
    'Displays the current TPM version or the specified module version', 
    (sender, args) => {
        if (args.length == 1) {
            sender.sendMessage(`TPM: \xA7b${version}`);
        } else {
            let moduleName = args[1];
            if (!fs.existsSync(modulesDir + moduleName)) {
                sender.sendMessage(`\xA7b${modulesDir}${moduleName} not found`);
            } else {
                let packageJSON = modulesDir + moduleName + '/package.json';
                if (fs.existsSync(packageJSON)) {
                    let jsonContents = require(fs.readFileSync(modulesDir + moduleName + '/package.json'));
                    sender.sendMessage(`${moduleName}: \xA7b${jsonContents.version || '1.0.0'}`);
                } else {
                    sender.sendMessage(`${moduleName}: \xA7b1.0.0`);
                }
            }
        }
}));

methods.push(new TpmMethod(
    'install', 
    'Installs a module', 
    (sender, args) => {
        assert(args.length > 1, '\xA7cCorrect usage: \xA7ftpm install [MODULE]');
        let moduleName = args[1];
        sender.sendMessage(`\xA7eInstalling ${moduleName}...`);
        if (fs.existsSync(modulesDir + moduleName)) {
                sender.sendMessage(`\xA7c${moduleName} is already installed. To update, call /tpm update ${moduleName}`);
                return;
        }
        fs.mkdirSync(modulesDir + moduleName);
        http.get(baseUrl + moduleName).then((result) => {
            for (var i = 0; i < result.length; i++) {
                var file = result[i];
                sender.sendMessage(`\xA7eDownloading ${file.path}...`);
                http.get(file.download_url).then((fileResult) => {
                    fs.writeFileSync(modulesDir + file.path, fileResult);
                }, (fileErr) => {
                    sender.sendMessage(fileErr);
                });
            }
            sender.sendMessage(`\xA7eFinished installing ${moduleName}`);
        }, (err) => {
            sender.sendMessage(`\xA7c${moduleName} does not exist. For a list of available modules, check out https://github.com/thiq/node_modules`);
        });
}));

methods.push(new TpmMethod(
    'uninstall',
    'Uninstalls a module',
    (sender, args) => {
        assert(args.length > 1, '\xA7cCorrect usage: \xA7ftpm uninstall [MODULE]');
        let moduleName = args[1];
        sender.sendMessage(`\xA7eUninstalling ${moduleName}...`);
        if (!fs.existsSync(modulesDir + moduleName)) {
            sender.sendMessage(`\xA7c${moduleName} is not installed`);
        } else {
            if (fs.rmdirSync(modulesDir + moduleName))
                sender.sendMessage(`\xA7eSuccessfully uninstalled ${moduleName}`);
            else 
                sender.sendMessage(`\xA7cFailed to delete directory`);
        }
    }
))