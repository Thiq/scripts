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

exports.constants = {
    SSL_OP_ALL: 0,
    SSL_OP_ALLOW_UNSAFE_LEGACY_RENEGOTIATION: 1,
    SSL_OP_CIPHER_SERVER_PREFERENCE: 2,
    SSL_OP_CISCO_ANYCONNECT: 3,
    SSL_OP_COOKIE_EXCHANGE: 4,
    SSL_OP_CRYPTOPRO_TLSEXT_BUG: 5,
    SSL_OP_DONT_INSERT_EMPTY_FRAGMENTS: 6,
    SSL_OP_EPHEMERAL_RSA: 7,
    SSL_OP_LEGACY_SERVER_CONNECT: 8,
    SSL_OP_MICROSOFT_BIG_SSLV3_BUFFER: 9,
    SSL_OP_MICROSOFT_SESS_ID_BUG: 10,
    SSL_OP_MSIE_SSLV2_RSA_PADDING: 11,
    SSL_OP_NETSCAPE_CA_DN_BUG: 12,
    SSL_OP_NETSCAPE_CHALLENGE_BUG: 13,
    SSL_OP_NETSCAPE_DEMO_CIPHER_CHANGE_BUG: 14,
    SSL_OP_NETSCAPE_REUSE_CIPHER_CHANGE_BUG: 15,
    SSL_OP_NO_COMPRESSION: 16,
    SSL_OP_NO_QUERY_MTU: 17,
    SSL_OP_NO_SESSION_RESUMPTION_ON_RENEGOTIATION: 18,
    SSL_OP_NO_SSLv2: 19,
    SSL_OP_NO_SSLv3: 20,
    SSL_OP_NO_TICKET: 21,
    SSL_OP_NO_TLSv1: 22,
    SSL_OP_NO_TLSv1_1: 23,
    SSL_OP_NO_TLSv1_2: 24,
    SSL_OP_PKCS1_CHECK_1: 25,
    SSL_OP_PKCS1_CHECK_2: 26,
    SSL_OP_SINGLE_DH_USE: 27,
    SSL_OP_SINGLE_ECDH_USE: 28
}

exports.DEFAULT_ENCODING = 'buffer';

exports.fips = false;
