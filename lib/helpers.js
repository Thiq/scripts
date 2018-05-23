// Helpers file that can be used across Thiq
Object.extend = function(source, target) {
    var properties = Object.getOwnPropertyNames(source);
    for (var i = 0; i < properties.length; i++) {
        var property = properties[i];
        target[property] = source[property];
    }
}

Object.printProperties = function(src) {
    for (var field in src) {
        console.log(field);
    }
}

String.prototype.toCamelCase = function() {
    var result = '';
    for (var i = 0; i < this.length; i++) {
        if (this[i] == '_') {
            result += ' ';
        } else {
            if (this[i - 1] == '_') {
                result += this[i].toUpperCase();
            } else {
                result += this[i].toLowerCase();
            }
        }
    }
    return result;
}