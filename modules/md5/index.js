var _a = function(ja) {
    var newarray = [];
    if (ja instanceof java.lang.Iterable) {
        var iter = ja.iterator();
        while (iter.hasNext()) {
            newarray.push(iter.next());
        }
        return newarray;
    } else if (_a instanceof java.util.Map) {
        ja = ja.values().toArray();
    }

    for (var i = 0; i < ja.length; ++i) {
        newarray.push(ja[i]);
    }

    return newarray;
}

var createHexString = function(arr) {
    var result = "";
    for (i in arr) {
        var str = arr[i].toString(16);
        str = str.length == 0 ? "00" :
            str.length == 1 ? "0" + str :
            str.length == 2 ? str :
            str.substring(str.length - 2, str.length);
        result += str;
    }
    return result;
}

module.exports = function(input) {
    var md = java.security.MessageDigest.getInstance('MD5');
    var bytes = new java.lang.String(input).bytes;
    md.update(bytes, 0, bytes.length);
    bytes = this._a(md.digest());
    return createHexString(bytes);
}