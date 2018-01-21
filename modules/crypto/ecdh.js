// Elliptic Curve Diffie-Hellman
exports.createECDH = function(generator) {

}

function ECDH(generator) {
    this.generator = generator;
}

ECDH.prototype.computeSecret = function(otherPublicKey, inputEncoding, outputEncoding) {

}

ECDH.prototype.generateKeys = function(encoding, format) {

}

ECDH.prototype.getGenerator = function(encoding) {

}

ECDH.prototype.getPrime = function(prime) {

}

ECDH.prototype.getPrivateKey = function(encoding) {

}

ECDH.prototype.getPublicKey = function(encoding, format) {

}

ECDH.prototype.setPrivateKey = function(privateKey, encoding) {

}

ECDH.prototype.setPublicKey = function(publicKey, encoding) {
    console.warn('ECDH.setPublicKey is deprecated. While functionality still exists, this cannot be promised for future releases.');
}

