/* jshint ignore:start */

var BufferedReader = require('@java.io.BufferedReader');
var InputStreamReader = require('@java.io.InputStreamReader');
var FileInputStream = require('@java.io.FileInputStream');
var BufferedWriter = require('@java.io.BufferedWriter');
var OutputStreamWriter = require('@java.io.OutputStreamWriter');
var FileOutputStream = require('@java.io.FileOutputStream');
var File = require('@java.io.File');
var Files = require('@java.nio.file.Files');
var path = require('internal/path/index');

exports.constants = {
    // file access
    F_OK: 0,
    R_OK: 1,
    W_OK: 2,
    X_OK: 3,
    // file open
    O_RDONLY: 4,
    O_WRONLY: 5,
    O_RDWR: 6,
    O_CREAT: 7,
    O_EXCL: 8,
    O_NOCTTY: 9,
    O_TRUNC: 10,
    O_APPEND: 11,
    O_DIRECTORY: 12,
    O_NOATIME: 13,
    O_NOFOLLOW: 14,
    O_SYNC: 15,
    O_SYMLINK: 16,
    O_DIRECT: 17,
    O_NONBLOCK: 18,
    // file type
    S_IFMT: 19,
    S_IFREG: 20,
    S_IFDIR: 21,
    S_IFCHR: 22,
    S_IFBLK: 23,
    S_IFIFO: 24,
    S_IFLNK: 25,
    S_IFSOCK: 26,
    // file mode
    S_IRWXU: 27,
    S_IRUSR: 28,
    S_IWUSR: 29,
    S_IXUSR: 30,
    S_IRWXG: 31,
    S_IRGRP: 32,
    S_IWGRP: 33,
    S_IXGRP: 34,
    S_IRWXO: 35,
    S_IROTH: 36,
    S_IWOTH: 37,
    S_IXOTH: 38
};

exports.exists = function(path) {
    return new File(path).exists();
}

exports.mkdir = function(path, mode) {
    return new File(path).mkdirs();
}

exports.read = function(location, buffer, offset, length, position) {
    var fIn = new BufferedReader(new InputStreamReader(new FileInputStream(location), "UTF8"));

    var line;
    var string = fIn.read(buffer, offset, length);

    fIn.close();
    return string;
}

exports.readdir = function(path, options) {
    var directory = new File(path);
    if (!directory.isDirectory()) throw 'Path must be a filename: ' + path;
    var files = [];
    var dirContents = directory.listFiles();
    for (var i = 0; i < dirContents; i++) {
        if (dirContents[i].isFile()) files.push(dirContents[i].getName());
    }
    return files;
}

/**
 * Reads a file synchronously, returning the contents as a string.
 * @param {string} path The path of the file.
 * @param {Object} options Read file options for the buffer. Not implemented.
 * @returns {string}
 */
exports.readFile = function(path, options) {
    var file = new File(path);
    if (!file.isFile()) return undefined;
    var fIn = new BufferedReader(new InputStreamReader(new FileInputStream(path), "UTF8"));

    var line;
    var string = "";
    while ((line = fIn.readLine()) != null) {
        string += line + '\n';
    }

    fIn.close();
    return string.length > 0 ? string : undefined;
}

exports.rename = function(oldPath, newPath) {
    var oldf = new File(oldPath);
    var newf = new File(newPath);
    return oldf.renameTo(newf);
}

exports.rmdir = function(path, callback) {
    new Promise(function (resolve, reject) {
        try {
            resolve(exports.rmdirSync(path));
        } catch (ex) {
            reject(ex);
        }
    }).then(function(result) {
        if (!callback) return;
        callback(undefined, result);
    }, function(err) {
        if (!callback) return;
        callback(err, undefined);
    });
}

exports.rmdir = function(path) {
    var f = new File(path);
    if (f.isDirectory()) {
        var subs = f.listFiles();
        for (var i = 0; i < subs.length; i++) {
            var sub = subs[i];
            if (sub.isFile()) sub.delete();
            else if (sub.isDirectory()) exports.rmdirSync(sub.getAbsolutePath());
        }
    }
    return f.delete();
}

var _writeString = function(fd, string, position, encoding) {
    var file = new File(fd);
    file.createNewFile();
    var f_out = new BufferedWriter(new OutputStreamWriter(new FileOutputStream(file), encoding || "UTF8"));

    f_out.write(string);
    f_out.flush();
    f_out.close();
}

exports.write = function(fd, buffer, offset, length, position) {
    if (typeof buffer == 'string') {
        _writeString(fd, buffer, offset, length);
    } else {
        _writeBuffer(fd, buffer, offset, length, position);
    }
}

exports.writeFile = function(file, data, options) {
    var f = new File(file);
    f.createNewFile();
    var f_out = new BufferedWriter(new OutputStreamWriter(new FileOutputStream(f), "UTF8"));
    f_out.write(data.toString(), 0, data.toString().length);
    f_out.flush();
    f_out.close();
}

exports.new = function(location, data) {
    var file = new File(data);
    file.createNewFile();
    var f_out = new BufferedWriter(new OutputStreamWriter(new FileOutputStream(file), "UTF8"));

    f_out.append(data);
    f_out.flush();
    f_out.close();
}

exports.clear = function(location) {
    save(file, '');
}

exports.mkdirs = function(directory) {
    new File(directory).mkdirs();
}

exports.isPath = function(location) {
    return new File(location).isDirectory();
}

exports.isFile = function(location) {
    return new File(location).isFile();
}

/* jshint ignore:end */