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