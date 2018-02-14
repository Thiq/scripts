exports.createVerify = function(generator) {
    return new Verify(generator);
}

function Verify(generator) {
    this.generator = generator;
}

Verify.prototype.update = function(data, inputEncoding) {

}

Verify.prototype.verify = function(object, signature, signatureFormat) {

}