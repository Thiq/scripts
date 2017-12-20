var mapit = require('map-it');

registerEvent(player, 'join', function(e) {
  mapit.giveMap(e.player);
});

registerCommand({
    name: 'tmap',
    usage: '\xA7e/<command>',
    permission: registerPermission('thiq.map', 'op'),
    permissionMessage: "\xA7cYou don't have permission to use this!",
    description: 'Brings up a map of the area.',
    aliases: ['tm']
}, function(sender, label, args) {
    if (!isPlayer(sender)) {
        console.log('\xA7cOnly a player can call tmap!');
        return;
    }
    mapit.giveMap(sender);
});
