var jPath = importClass('java.nio.file.Paths');
var os = require('os');

function getDirSep() {
    if (os.platform() == 'win32') return '\\';
    else return '/';
}

exports.basename = function(path, ext) {
    if (typeof path != 'string') throw 'Path must be a string';
    var pathSplit = path.split(getDirSep());
    var found = pathSplit[pathSplit.length - 1];
    if (ext != undefined) {
        for (var i = 0; i < ext.length; i++) {
            if (found.endsWith(ext[i])) {
                found = found.replace(ext[i], '');
            }
        }
    }

    return found;
}

exports.delimiter = os.platform() == 'win32' ? ';' : ':';

exports.dirname = function(path) {
    var separator = getDirSep();
    var split = path.split(separator);
    var result = '';
    for (var i = 0; i < split.length - 1; i++) {
        result += (separator + split[i]);
    }
    return result;
}

exports.extname = function(path) {
    var split = path.split('.');
    return split[split.length - 1];
}

exports.format = function(pathObject) {
    var sep = getDirSep();
    var dir = '';
    var file = '';
    if (pathObject.base != undefined && pathObject.dir) {
        dir = pathObject.dir + sep;
    } else if (!pathObject.dir) {
        dir = pathObject.root + sep;
    }
    if (!pathObject.base) {
        file = pathObject.name + pathObject.ext;
    } else {
        file = pathObject.base;
    }
    return dir + sep + file;
}

exports.isAbsolute = function(path) {
    return jPath.get(path).isAbsolute();
}

exports.join = function(paths) {
    return arrayToString(paths, getDirSep());
}

exports.jnormalize = function(path) {
    return jPath.get(path).normalize();
}

exports.normalize = function(path) {
    return exports.jnormalize(path).toString();
}

exports.parse = function(path) {
    var jp = jPath.get(path);
    var file = jp.getFileName().toString().split('.');
    var e = file[file.length - 1];
    return {
        root: jp.getRoot().toString(),
        dir: jp.getParent().toString(),
        base: jp.getFileName().toString(),
        name: jp.getFileName().toString().replace(e, ''),
        ext: e
    };
}

exports.jrelative = function(from, to) {
    return jPath.get(from).relative(jPath.get(to));
}

exports.relative = function(from, to) {
    return exports.jrelative(from, to).toString();
}

exports.jresolve = function(paths) {
    if (paths.length == 0) return '';
    if (typeof paths == 'string') {
        paths = [paths];
    }
    var lastPath = jPath.get(paths[0]);
    for (var i = 1; i < paths.length; i++) {
        lastPath = lastPath.resolve(jPath.get(paths[i]));
    }
    return lastPath;
}

exports.resolve = function(paths) {
    return exports.jresolve(paths).toString();
}

exports.sep = getDirSep();

exports.posix = {};
exports.win32 = {};