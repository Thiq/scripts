const ender = require('ender-chest');
const guid = require('guid');
const guildsTable = ender.getTable('guilds');

function Guild(name) {
    this.name = name;
    this.id = guid().toString();
    this.members = []; // an array of player IDs.
    this.xp = 0;
    this.level = 1;
    guildsTable.set(id, this);
}

Guild.prototype.addPlayer = function(player) {
    this.members.push(player.getUniqueId());
}

Guild.prototype.removePlayer = function(player) {
    this.members.splice(this.members.indexOf(player.getUniqueId()), 1);
}

exports.Guild = Guild;
exports.getGuild = function(id) {
    return guildsTable.get(id);
}

