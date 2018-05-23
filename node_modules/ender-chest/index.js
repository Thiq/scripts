const fs = require('fs');
const path = require('path');

let datadir = './ender/';
let tables = {};

/**
 * Represents a table within the store.
 * @param {String} name 
 */
function EnderTable(name) {
    this.name = name;
    this.values = loadTable(name) || {};
}

/**
 * Returns a value within the table.
 * @param {String} property The property to be returned.
 * @returns {EnderTable}
 */
EnderTable.prototype.get = function(property) {
    return this.values[property];
}

/**
 * Sets a value within the table and then saves it.
 * @param {String} property The name of the property.
 * @param {*} value The value of the property.
 */
EnderTable.prototype.set = function(property, value) {
    this.values[property] = value;
    this.save();
}

/**
 * Saves the current table to the store.
 */
EnderTable.prototype.save = function() {
    saveTable(this);
}

function loadTable(name) {
    if (fs.existsSync(`${datadir + name}.db`)) {
        var data = fs.readFileSync(`${datadir + name}.db`, {}) || {};
        return data;
    } else {
        return false;
    }
}

function saveTable(table) {
    fs.writeFileSync(`${datadir + table.name}.db`, table.values, {});
}

/**
 * Initializes the stores.
 */
exports.initialize = function() {
    if (!fs.existsSync('./ender/')) {
        fs.mkdirSync('./ender/');
    }
}

/**
 * Returns a table from within the store, creating a new one if it doesn't exist.
 * @param {String} name The name of the table.
 */
exports.getTable = function(name) {
    if (!tables[name]) tables[name] = new EnderTable(name);
    return tables[name];
}

/**
 * Deletes a table from within the store and removes any artifacts.
 * @param {String} name 
 */
exports.deleteTable = function(name) {
    fs.rmdirSync('./ender/' + name);
    tables[name] = undefined;
}