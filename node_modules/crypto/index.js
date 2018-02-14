var certificate = require('certificate');
var consts = require('const');
var dh = require('dh');
var ecdh = require('ecdh');
var hash = require('hash');
var hmac = require('hmac');
var sign = require('sign');
var verify = require('verify');


function createHexString(arr) {
    var result = "";
    for (var i in arr) {
        var str = arr[i].toString(16);
        str = str.length == 0 ? "00" :
            str.length == 1 ? "0" + str :
            str.length == 2 ? str :
            str.substring(str.length - 2, str.length);
        result += str;
    }
    return result;
}


exports.DEFAULT_ENCODING = 'buffer';
exports.fips = false;

exports.createDiffieHellman = dh.createDiffiHellman;
exports.createECDH = ecdh.createECDH;
exports.createHash = hash.createHash;
exports.createHmac = hmac.createHmac;
exports.createSign = sign.createSign;
exports.createVerify = verify.createVerify;