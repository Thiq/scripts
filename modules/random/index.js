/**
 * @typedef {function(number, number)} random
 * @param {Number} min 
 * @param {Number} max 
 * @returns {Number}
 */
function random(min, max) {
    if (min > max) {
        throw new Error('Random minimum limits must be less than the max!');
    }
    var dif = max - min;
    var r = Math.random();
    return r * dif;
}
exports = random;