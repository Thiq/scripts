import * as guid from 'guid';

export default class Scoreboard {
    private _sb;
    private _obj;
    private _id;
    private _scores;

    constructor(name: string) {
        this._sb = Bukkit.getScoreboardManager().getNewScoreboard();
        this._id = guid().substring(0, 16);
        this._scores = [];
        this._obj = this._sb.registerNewObjective(this._id, name);
        this._obj.setDisplaySlot(org.bukkit.scoreboard.DisplaySlot.SIDEBAR);
        this._obj.setDisplayName(name);
    }

    addEntry(name: string, value): Scoreboard {
        var score = this._obj.getScore(name);
        score.setScore(value);
        this._scores.push(score);
        return this;
    }

    setEntry(index: number, value: number) {
        this._scores[index].setScore(value);
    }

    removeEntry(index: number) {

    }

    send(player) {
        player.setScoreboard(this._sb);
    }

    destroy() {
        this._sb.clearSlot(org.bukkit.scoreboard.DisplaySlot.SIDEBAR);
    }
}