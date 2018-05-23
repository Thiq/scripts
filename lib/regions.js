const guilds = require('guilds');
const ender = require('ender-chest');

const table = ender.getTable('regions');

function Region(name, world) {
    this.name = name;
    this.world = world;
    this.guildStatus = table.get('guildStatus'); // an object of GuildStatus
}

Region.prototype.setGuild = function(id) {
    this.guildStatus = new GuildStatus(id);
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

registerCommand({
    name: 'regions',
    description: 'Manages regions within the server',
    usage: '\xA7e<command>'
}, (sender, label, args) => {
    if (args.length == 0) {
        // return info about the current region.
        let currentRegion = sender.getWorld().getName();
        return;
    }
    switch(args[0]) {
        case 'list':
        case 'l':
            break;
        case 'add':
        case 'new':
            break;
        case 'remove':
        case 'delete':
            break;
        case 'status':
            break;
        default:
            break;
    }
});