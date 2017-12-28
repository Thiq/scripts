import * as fs from 'fs';
import * as path from 'path';

let datadir: string = './ender/';

export class EnderTable {
    name: string;
    values: any;

    constructor(name: string) {
        this.name = name;
        this.values = loadTable(name) || {};
    }

    get(property: string): any {
        return this.values[property];
    }

    set(property: string, value: any) {
        this.values[property] = value;
        saveTable(this);
    }
}

function loadTable(name: string): any {
    if (fs.exists(datadir + name + '.json')) {
        var data = fs.readFileSync(datadir + name + '.json') || {};
        var JSONdata = JSON.parse(data.toString());
        return JSONdata;
    }
    return undefined;
}

function saveTable(table: EnderTable) {
    fs.writeFileSync(datadir + table.name + '.json', table.values);
}