function createArrayFromString(input, length) {
    var result = [];
    for (var i = 0; i < length; ++i) {
        result[i] = new String(input);
    }
    return result;
}

module.exports = {
    createArrayFromString
}