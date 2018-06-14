var octet = '(?:[0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])'
var ipv4Reg = new RegExp('^' + octet + '[.]' + octet + '[.]' + octet + '[.]' + octet + '$');

function isIP(s) {

}

function isIPv4(s) {

}

function isIPv6(s) {

}

function isLegalPort(port) {

}

function makeSyncWrite(fd) {

}

module.exports = {
    isIP,
    isIPv4,
    isIPv6,
    isLegalPort,
    makeSyncWrite,
    normalizedArgsSymbo: Symbol('normalizedArgs')
}