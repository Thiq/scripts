const fs = require('fs');
const path = require('path');

let datadir = './ender/';
let tables = {};

function EnderTable(name) {
    this.name = name;
    this.values = loadTable(name) || {};
}

EnderTable.prototype.get = function(property) {
    return this.values[property];
}

EnderTable.prototype.set = function(property, value) {
    this.values[property] = value;
    this.save();
}

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

exports.initialize = function() {
    if (!fs.existsSync('./ender/')) {
        fs.mkdirSync('./ender/');
    }
}

exports.getTable = function(name) {
    if (!tables[name]) tables[name] = new EnderTable(name);
    return tables[name];
}

exports.deleteTable = function(name) {
    fs.rmdirSync('./ender/' + name);
    tables[name] = undefined;
}