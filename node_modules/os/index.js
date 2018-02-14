var system = importClass('java.lang.System');
var osName = system.getProperty('os.name');

function isOSX() {
    return osName.startsWith('Mac OS X');
}

function isWindows() {
    return osName.startsWith('Windows');
}

function isLinux() {
    return osName.startsWith('Linux');
}

function isSunOS() {
    return osName.startsWith('SunOS');
}

function isFreeBSD() {
    return osName.startsWith('FreeBSD');
}

function isOpenBSD() {
    return osName.startsWith('OpenBSD');
}

exports.EOL = isWindows() ? '\r\n' : '\n';

exports.platform = function() {
    if (isOSX()) return 'darwin';
    if (isWindows()) return 'win32';
    if (isLinux()) return 'linux';
    if (isSunOS()) return 'sunos';
    if (isFreeBSD()) return 'freebsd';
    if (isOpenBSD()) return 'openbsd';
    throw 'Could not determine OS platform';
}

exports.type = function() {
    if (isOSX()) return 'Darwin';
    if (isLinux() || isSunOS() || isFreeBSD() || isOpenBSD()) return 'Linux';
    if (isWindows()) return 'Windows_NT';
    throw 'Could not determine OS type';
}