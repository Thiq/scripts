var version = require('internal/util/version');
var NativeModule = require('internal/bootstrap/loader').NativeModule;

var jio = require('@java.io');
var BufferedReader = jio.BufferedReader;
var InputStreamReader = jio.InputStreamReader;
var FileInputStream = jio.FileInputStream;
var BufferedWriter = jio.BufferedWriter;
var OutputStreamWriter = jio.OutputStreamWriter;
var FileOutputStream = jio.FileOutputStream;
var File = require('@java.io.File');
var Path = require('@java.nio.file.Paths');
var $root = path_resolve(process.cwd(), process.config.modules_dir);

var isWin32 = Java.type('java.lang.System').getProperty('os.name').startsWith('Windows');
var sep = isWin32 ? '\\' : '/';
var wrapper = [
	'(function (exports, module, require, __filename, __dirname, process) {',
	'\n})'
];

function Exports() {
	
}

function ExtLoader(ext, handler) {
	this.ext = ext[0] === '.' ? ext : '.' + ext;
	this.handler = handler;
}

function Module(id, filename) {
	this.id = id;
	this.filename = filename;
	this.fn = new Function();
	this.children = {};
	this.exports = new Exports();
	this.isLoaded = false;
	this.isNative = false;
	this.config = null;
}

Module._packageCache = Object.create(null);
Module._exts = Object.create(null);

Module._exts['.js'] = new ExtLoader('.js', function (input) {
	return input;
});

Module._exts['.json'] = new ExtLoader('.json', function (input) {
	return JSON.parse(input);
});

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

function wrap(script) {
	return wrapper[0] + script + wrapper[1];
}

function isRequestRelative(request) {
	return request[0] == '.' && (request[1] == sep || request[1] == '.');
}

function assureExt(requestPath) {
	if (fs_exists(requestPath)) return requestPath;
	for (var field in Module._exts) {
		var loader = Module._exts[field];
		// at this point, we haven't found the file, so plug in the extensions and see if they exists
		var realPath = requestPath + loader.ext;
		if (fs_exists(realPath)) return realPath;
	}
	throw new Error('No loader for ' + requestPath + ' exists. To add one, reference Require.exts');
}

function getLoader(filename) {
	for (var field in Module._exts) {
		if (filename.endsWith(field)) return Module._exts[field];
	}

	return Module._exts['.js'];
}

function resolveEntry(requestPath) {
	try {
		var jsonPath = path_resolve(requestPath, 'package.json');
		var json = fs_read(jsonPath);
		return JSON.parse(json).main;
	} catch (ex) {
		console.error('Could not locate module ' + requestPath);
		console.error('Be sure to run "tpm install" to install all dependent packages for your modules');
		throw new Error('Failed to configure module ' + requestPath + ': ' + ex.message);
	}
}

/**
 * Resolves the relative path to execution and the module that called the Require.
 * @param {String} request 
 * @param {Module} caller 
 */
function resolveFile(request, caller) {
	if (!caller) caller = {
		filename: $root
	};
	var dir = path_dirname(caller.filename);
	return path_resolve(dir, request);
}

function tryFile(request, caller) {
	if (isRequestRelative(request)) {
		return resolveFile(request, caller);
	} else {
		return resolveEntry(path_resolve($root, request));
	}
}

function resolveModule(request, caller) {
	var file = tryFile(request, caller);
	var isRelative = isRequestRelative(request);
	if (!file && !isRelative) {
		// this will happen if the package.json doesn't include a 'main' property
		file = path_resolve($root, request, 'index.js');
	} else {
		// if we have a 'main' property in the package
		if (isRelative) {
			file = assureExt(file);
		} else {
			file = path_resolve($root, request, file);
		}
	}
	file = path_normalize(file);
	if (Module._packageCache[file]) return Module._packageCache[file];
	var m = new Module(request, file, isRelative ? caller : undefined);
	if (!isRelative) {
		var pkgJSON = path_normalize(path_resolve($root, m.id, 'package.json'));
		m.config = JSON.parse(fs_read(pkgJSON));
		m.id = m.config.name || m.id;
	}
	return m;
}

Module.prototype.compile = function() {
	if (this.config && this.config._jvmversion) {
		if (version.gte(this.config._jvmversion, '1.' + version.getJvmVersion())) {
			throw new Error('Module ' + this.id + ' is incompitable with Java version ' + version.getJvmVersion());
		}
	}
	if (this.config && this.config._bukkitversion) {
		if (version.gte(this.config._bukkitversion, version.getBukkitVersion())) {
			throw new Error('Module ' + this.id + ' is incompatible with Bukkit version ' + version.getBukkitVersion());
		}
	}
	var loader = getLoader(this.filename);
	var script = fs_read(this.filename);
	var compiled = loader.handler(script);
	if (typeof compiled == 'string') {
		var wrapped = wrap(compiled);
		this.fn = eval(wrapped);
	} else {
		this.fn = function () {
			this.exports = compiled;
		}
	}

	var self = this;

	var args = [
		self.exports,
		self,
		function (request) {
			return Require(request, self);
		},
		self.filename,
		path_dirname(self.filename),
		process
	];

	try {
		this.fn.apply(null, args);
	} catch (ex) {
		console.error('An error occured when reading ' + this.filename + ': ' + ex.message);
		console.error(ex);
		ex.derivesFromRequire = true;
		throw ex;
	}

	if (this.exports.default) this.exports = this.exports.default;
	this.isLoaded = true;
}

Module.prototype.cache = function() {
	Module._packageCache[this.filename] = this;
}

Module.fromCache = function(request) {
	return Module._packageCache[request];
}

function Require(request, caller, isGlobal) {
	if (request[0] == '@') return eval(request.substr(1));
	if (isWin32) request = request.replace('/', '\\');
	else request = request.replace('\\', '/');

	if (!isRequestRelative(request)) {
		try {
			NativeModule.require(request);
			return NativeModule.getCached(request).exports;
		} catch (ex) {}
	}

	var _module = resolveModule(request, caller);
	if (Module._packageCache[_module.filename]) {
		return Module._packageCache[_module.filename].exports;
	}

	_module.cache();
	_module.compile();

	if (_module.exports == {}) console.warn(_module.id + ' has no exports');

	return _module.exports;
}

Require.unregisterModules = function () {
	Module._packageCache = Object.create(null);
}

Require.exts = Module._exts;
Require.Module = Module;
Require.ExtLoader = ExtLoader;

module.exports = Require;
