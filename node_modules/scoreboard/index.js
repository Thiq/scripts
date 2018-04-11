const guid = require('guid');
const DisplaySlot = require('@org.bukkit.scoreboard');

function Scoreboard(name) {
    this._name = name;
    this._sb = Bukkit.getScoreboardManager().getNewScoreboard();
    this._id = guid().toString().substring(0, 16);
    this._obj = this._sb.registerNewObjective(this._id, name);
    this._obj.setDisplaySlot(DisplaySlot.SIDEBAR);
    this._obj.setDisplayName(name);
}

Scoreboard.prototype.addEntry = function(name, value, id) {
    var score = this._obj.getScore(name);
    score.setScore(value);
    this._scores[id.toString()] = { name: name, value: value, id: id, score: score };
    return score;
}

Scoreboard.prototype.setEntry = function(id, value, text) {
    var entry = this._scores[id.toString()];
    if (!entry) return;
    entry.value = value;
    entry.name = text || entry.name;
    this.updateEntries();
    return this;
}

Scoreboard.prototype.removeEntry = function(id) {
    this._scores[id.toString()] = undefined;
    this.updateEntries();
    return this;
}

Scoreboard.prototype.updateEntries = function() {
    this._obj.unregister();
    this._obj = this._sb.registerNewObjective(this._id, this._name);
    this._obj.setDisplaySlot(DisplaySlot.SIDEBAR);
    this._obj.setDisplayName(this._name);
    for (let entry in this._scores) {
        let e = this._scores[entry];
        if (!e) continue;
        if (!e.name || e.name.length == 0) continue;
        let score = this._obj.getScore(e.name);
        score.setScore(e.value);
    }
}

Scoreboard.prototype.send = function(player) {
    if (!player.setScoreboard) return;
    player.setScoreboard(this._sb);
}

Scoreboard.prototype.destroy = function() {
    this._sb.clearSlot(DisplaySlot.SIDEBAR);
}

exports.Scoreboard = Scoreboard;