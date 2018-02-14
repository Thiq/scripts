// DiffieHellman
exports.createDiffieHellman = function(generator) {
    return new DiffieHellman(generator);
}

DiffieHellmanErrors = {
    DH_CHECK_P_NOT_SAFE_PRIME: 0x001F,
    DH_CHECK_P_NOT_PRIME: 0x002F,
    DH_UNABLE_TO_CHECK_GENERATOR: 0x003F,
    DH_NOT_SUITABLE_GENERATOR: 0x004F
}

function DiffieHellman(generator) {
    this.generator = generator;
    this.verifyError = checkDHERrors(generator);
}

function checkDHErrors(generator) {
    // TODO:
    return false;
}

DiffieHellman.prototype.computeSecret = function(otherPublicKey, inputEncoding, outputEncoding) {

}

DiffieHellman.prototype.generateKeys = function(encoding) {

}

DiffieHellman.prototype.getGenerator = function(encoding) {

}

DiffieHellman.prototype.getPrime = function(prime) {

}

DiffieHellman.prototype.getPrivateKey = function(encoding) {

}

DiffieHellman.prototype.getPublicKey = function(encoding) {

}

DiffieHellman.prototype.setPrivateKey = function(privateKey, encoding) {

}

DiffieHellman.prototype.setPublicKey = function(publicKey, encoding) {

}
