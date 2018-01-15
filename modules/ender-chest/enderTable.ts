import * as fs from 'fs';
import * as path from 'path';
import * as async from 'async';

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
        this.save();
    }

    save() {
        saveTable(this);
    }
}

function loadTable(name: string): any {
    if (fs.existsSync(`${datadir}${name}.db`)) {
        var data = fs.readFileSync(`${datadir}${name}.db`) || {};
        var JSONdata = JSON.parse(data.toString());
        return JSONdata;
    } else {
        return false;
    }
}

function saveTable(table: EnderTable) {
    fs.writeFileSync(`${datadir}${table.name}.db`, table.values);
}