var ender = require('ender-chest');
var fs = require('fs');

/**
 * Returns a plugin with the passed name. If no argument, then it returns Thiq.
 * @param {string=} name
 */
function getPlugin(name) {
    if (typeof(name) !== 'string') {
        name = "Thiq";
    }
    return loader.server.pluginManager.getPlugin(name);
}

var plugin = getPlugin();

function evalScript(javascript) {
    try {
        return eval(javascript);
    } catch (exception) {
        var ex = exception;
        if (ex.sciptExcetion) {
            ex = ex.sciptExcetion;
            while (ex && ex.unwrap) {
                ex = ex.unwrap().cause;
            }
            ex = (ex || { message: "Unknown error" }).message;
        }

        log(ex);
        if (/syntax error/i.test(ex)) {
            throw "\n" + javascript;
        } else {
            throw exception;
        }
    }
}

function callEvent(handler, event, data) {
    if (handler[event]) {
        handler[event](data);
    }
}

function cmdEval(message, sender, type) {
    currEvalPlr = sender;
    try {
        var event = {
            sender: sender,
            type: type,
            ext: {}
        }
        callEvent(js, "extensions", event);
        var result;
        with(event.ext) {
            result = evalScript(message);
        }
        callEvent(js, "evalComplete", {
            sender: sender,
            result: result
        });
        if (result === undefined) {
            result = "undefined";
        } else if (result === null) {
            result = "null";
        }
        sender.sendMessage("\xA7a=> " + result);
        return result;
    } catch (ex) {
        sender.sendMessage("\xA7c" + ex);
        return undefined;
    }
}
var currEvalPlr;

function loadLibraryScript(name, loader) {
    log('Loading library script ' + name, 'd');
    if (fs.exists('./plugins/Thiq/libs/' + name)) {
        var paramsObject = {
            exports: {}
        }
        var contents = loader.exports.compileFn(_readFile('./plugins/Thiq/libs/' + name));
        for (var e in paramsObject.exports) {
            var globalExport = paramsObject.exports[e];
            if (paramsObject.exports.hasOwnProperty(e)) global[e] = globalExport;
        }
        callFn(contents, paramsObject);
    } else {
        log('Could not locate library script ' + name, 'c');
    }
}

registerCommand({
    name: "js",
    description: "Executes javascript in the server",
    usage: "\xA7cUsage: /<command> [javascript code]",
    permission: registerPermission("thiq.js", "op"),
    permissionMessage: "\xA7cYou don't have permission to use that!",
    aliases: ["javascript"]
}, function(sender, label, args) {
    var message = args.join(" ");

    if (message.length < 1) {
        return false;
    }

    message = message.replace(/\{clipboard\}/i, sender.clipboardText);

    sender.sendMessage("\xA77>> " + message);

    cmdEval(message, sender, "js");
});

function initializeThiq() {
    console.log('Initializing libraries...', 'd');
    // cancel all pending async tasks
    cancelAllIntervals();
    // load databases
    ender.initialize();

    libraryConfig = new config('./plugins/Thiq/thiq.json').load();
    // load block IDs now
    var blocks = JSON.parse(fs.readFileSync('./plugins/Thiq/core/data.json'));
    log('Loading libraries...', 'd');
    // load the lib files
    for (var i = 0; i < libraryConfig.libraries.length; i++) {
        var value = libraryConfig.libraries[i];
        if (typeof value == 'string') {
            loadLibraryScript(value, findLoaderForFile(value));
        } else if (typeof value == 'object') {
            loadLibraryScript(value.file, value.loader);
        }
    }
    log('Calling startup...', 'd');
    var startupContents = _readFile('./plugins/Thiq/startup.js');
    callFn(startupContents, {});
    log('Startup complete.', 'd');
}

initializeThiq();
