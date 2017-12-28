exports.getSHA64 = function(input, seed) {

}

exports.getSHA128 = function(input, seed) {

}

exports.getSHA256 = function(input, seed) {

}

exports.getSHA512 = function(input, seed) {

}

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

exports.getMD5 = function(input) {
    var md = java.security.MessageDigest.getInstance('MD5');
    var bytes = new java.lang.String(input).bytes;
    md.update(bytes, 0, bytes.length);
    bytes = this._a(md.digest());
    return createHexString(bytes);
};