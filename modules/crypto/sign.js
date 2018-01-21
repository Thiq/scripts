exports.createSign = function(generator) {
    return new Sign(generator);
}

function Sign(generator) {
    this.generator = generator;
}

Sign.prototype.sign = function(privateKey, outputFormat) {

}

Sign.prototype.update = function(data, inputEncoding) {

}