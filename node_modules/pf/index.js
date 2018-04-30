const fs = require('fs');
const path = require('path');

let cachedProfiles = {};
let profileDir = './cached_profiles/';

function Profile(uuid) {
    this._uuid = uuid;
    if (cachedProfiles[uuid]) this._tables = cachedProfiles[uuid]._tables || {};
    else this._tables = {};
}

Profile.prototype.set = function(table, property, value) {
    if (!this._tables[table]) {
        this._tables[table] = {};
    }
    this._tables[table][property] = value;
    // save the profile
    this.save();
}

Profile.prototype.get = function(table, property) {
    if (!this._tables[table]) {
        return undefined;
    } else {
        return this._tables[table][property];
    }
}

Profile.prototype.save = function() {
    var path = getPathFor(this._uuid);
    cachedProfiles[this._uuid] = this;
    fs.writeFileSync(path, this._tables);
    return this;
}

Profile.prototype.load = function() {
    var path = getPathFor(this._uuid);
    var tables = JSON.parse(fs.readFileSync(path, {}) || {});
    this._tables = tables;
    cachedProfiles[this._uuid] = this;
    this.save();
    return this;
}

Profile.getProfile = function(id) {
    var profile = cachedProfiles[id];
    if (!profile) {
        profile = new Profile(id);
        profile.save();
    }
    return profile;
}

Profile.initialize = function() {
    var p = Bukkit.getOnlinePlayers();
    for (let i = 0; i < p.length; i++) {
        new Profile(p[i].getUniqueId()).load();
    }
}

function getPathFor(uuid) {
    return path.resolve([profileDir, uuid + '.json' ]);
}

eventHandler('player', 'join', (e) => {
    cachedProfiles = new Profile(e.player.getUniqueId()).load();
});

eventHandler('player', 'quit', (e) => {
    cachedProfiles[e].save();
});

exports.Profile = Profile;
exports.getProfile = Profile.getProfile;
exports.initialize = Profile.initialize;