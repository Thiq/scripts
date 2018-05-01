const guilds = require('guilds');
const ender = require('ender-chest');

const table = ender.getTable('regions');

function Region(name) {
    this.name = name;
    this.guildStatus = table.get('guildStatus') || {}; // an object of { GUID: GuildStatus }
}

function GuildStatus(guildId) {
    this.guildId = guildId;
    this.influence = 0; 
    /*
    things that affect influence:
    - quests completed by guild members
    - income by the guild members (calculated by how much currency the guild receives from stores)
    - how much in purchases the guild itself has
    */
}