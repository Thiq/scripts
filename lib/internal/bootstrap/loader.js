/**
 * bootstrap/loader.js
 * ===================
 * This file is in charge of loading internal modules. This file is called before any 
 * others in the core in order to setup proper and consistent loading (besides plugin.js).
 * After this is loaded, it is passed to bootstrap/core.js. The require given to these 
 * internal modules cannot load external modules, and the global require cannot load these 
 * modules. 
 */

global = this;

Object.prototype.toString = function () {
    try {
        return JSON.stringify(this, ' ', '\t').replace(/\t/g, "  ");
    } catch (e) {
        return "[object Object]"
    }
}
Array.prototype.toString = function () {
    try {
        return JSON.stringify(this, ' ', '\t').replace(/\t/g, "  ");
    } catch (e) {
        return "[object Array]"
    }
}

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
            ex = (ex || {
                message: "Unknown error"
            }).message;
        }

        if (/syntax error/i.test(ex)) {
            throw "\n" + javascript;
        } else {
            throw exception;
        }
    }
}

var Bukkit = org.bukkit.Bukkit;

(function () {

    var BufferedReader = Java.type('java.io.BufferedReader');
    var InputStreamReader = Java.type('java.io.InputStreamReader');
    var FileInputStream = Java.type('java.io.FileInputStream');
    var BufferedWriter = Java.type('java.io.BufferedWriter');
    var OutputStreamWriter = Java.type('java.io.OutputStreamWriter');
    var FileOutputStream = Java.type('java.io.FileOutputStream');
    var File = Java.type('java.io.File');
    var Path = Java.type('java.nio.file.Paths');

    var isWin32 = Java.type('java.lang.System').getProperty('os.name').startsWith('Windows');
    var sep = isWin32 ? '\\' : '/';

    var plugin = Bukkit.getPluginManager().getPlugin('Thiq');
    var wrapper = [
        '(function (exports, module, require, process, plugin) {',
        '\n})'
    ];
    global.process = configureProcess();

    function NativeModule(id) {
        this.filename = 'lib/internal/' + id + '.js';
        this.id = id;
        this.exports = {};
        this.reflect = undefined;
        this.exportsKeys = undefined;
        this.loaded = false;
        this.loading = true;
        this.isNative = true;
    }

    NativeModule.prototype.toString = function () {
        return '[NativeModule ' + this.id + ']';
    }

    NativeModule._source = {}; // TODO: setup natives
    NativeModule._cache = {};

    var loaderExports = {
        NativeModule
    };
    var loaderId = 'bootstrap/loader';

    NativeModule.require = function (id) {
        if (id[0] == '@') return eval(id.substr(1));
        if (id === loaderId) return loaderExports;
        var cached = NativeModule.getCached(id);
        if (cached && (cached.loaded || cached.loading)) return cached.exports;

        var nativeModule = new NativeModule(id);
        // this is so fucking stupid but for some reason .compile() doesn't do a valid check 
        // if the fucking file works or not
        if (!fs_exists(process.cwd() + nativeModule.filename)) throw new Error();
        nativeModule.cache();
        nativeModule.compile();

        return nativeModule.exports;
    }

    NativeModule.wrap = function (script) {
        return wrapper[0] + script + wrapper[1];
    }

    NativeModule.prototype.cache = function () {
        NativeModule._cache[this.id] = this;
    }

    NativeModule.getCached = function (id) {
        return NativeModule._cache[id];
    }

    NativeModule.prototype.compile = function () {
        var self = this;

        function build(contents) {
            var wrapped = NativeModule.wrap(contents);
            var args = [
                self.exports,
                self,
                NativeModule.require,
                process,
                plugin
            ];
            var compiled = eval(wrapped);
            try {
                compiled.apply(null, args);
                self.loaded = true;
            } catch (ex) {
                if (ex.derivesFromRequire) throw ex;
                console.error('An internal error occured when reading ' + self.filename + ': ' + ex.message);
                console.error(ex);
                throw ex;
            } finally {
                self.loading = false;
            }
        }
        
        if (fs_exists(process.cwd() + this.filename)) {
            script = fs_read(process.cwd() + this.filename);
            console.debug('Found local file for ' + this.id);
            build(script);
        } else {
            var resx = hasResource(this.filename);
            try {
                console.log(resx.length.toString());
            } catch (ex) {
                throw new Error('File does not exist in resources');
            }
            var fIn = new BufferedReader(new InputStreamReader(resx));
            var line;
            var string = '';
            while ((line = fIn.readLine()) != null) {
                string += line + '\n';
            }
            fIn.close();
            build(string);
        }
        return this.exports;
    }

    function hasResource(filename) {
        return plugin.getResource(filename);
    }

    function fs_read(location) {
        var fIn = new BufferedReader(new InputStreamReader(new FileInputStream(location), "UTF8"));

        var line;
        var string = "";
        while ((line = fIn.readLine()) != null) {
            string += line + '\n';
        }

        fIn.close();
        return string;
    }

    function fs_exists(path) {
        return new File(path).exists();
    }

    function path_absolute(path) {
        return Path.get(path).toAbsolutePath().toString();
    }

    function path_normalize(path) {
        return Path.get(path).normalize().toString();
    }

    function path_dirname(path) {
        var result = '';
        var subs = path.split(sep);
        for (var i = 0; i < subs.length - 1; i++) {
            result += (subs[i] + sep);
        }
        return result;
    }

    function path_resolve() {
        var paths = Array.prototype.slice.call(arguments);
        if (paths.length === 0) return '';
        var lastPath = Path.get(paths[0]);
        for (var i = 1; i < paths.length; i++) {
            lastPath = lastPath.resolve(Path.get(paths[i]));
        }

        return lastPath.toString();
    }

    function configureProcess() {
        var process = {
            config: {},
            cwd: function () {
                return './plugins/Thiq/';
            }
        };
        var config = fs_read(process.cwd() + 'package.json');
        try {
            var json = JSON.parse(config);
            process.config = json;
        } catch (ex) {
            var err = new Error("Error reading package.json: " + ex.message);
            throw err;
        }

        return process;
    }

    var debugMessages = process.config.verbose_logging;

    function log(msg, level, verbose) {
        if (verbose && !debugMessages) return;
        if (!level) level = "f";
        if (msg instanceof Array) {
            loader.server.consoleSender.sendMessage("\xA7" + level + "[Thiq] " + msg.join('\n'));
        } else {
            loader.server.consoleSender.sendMessage("\xA7" + level + "[Thiq] " + msg);
        }
    }

    var console = global.console = {
        log: log,
        warn: function (msg) {
            log(msg, 'd', false)
        },
        debug: function (msg) {
            log(msg, 'a', true)
        },
        error: function (msg) {
            log(msg, 'c', false)
        },
        trace: log
    };

    NativeModule.require('process/core');
    NativeModule.require('bootstrap/core');

    return loaderExports;
})();