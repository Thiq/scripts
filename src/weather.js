// An example of using the GUI to control weather.
var Gui = require('gui');
var assert = require('assert');

var weatherGui = new Gui();
weatherGui.setTitle('Weather Master');
weatherGui.add(itemStack({
    type: 160,
    data: 4
}), { name: '\xA7eSunny' },
    function(player) {
        player.world.setStorm(false);
        player.sendMessage('Set weather to sunny!');
    });
weatherGui.add(itemStack({
    type: 160,
    data: 3
}), { name: '\xA7bLight rain' },
    function(player) {
        player.world.setStorm(true);
        player.world.setThundering(false);
        player.sendMessage('Set weather to light rain!');
    });
weatherGui.add(itemStack({
    type: 160,
    data: 11
}), { name: '\xA79Stormy' },
    function(player) {
        player.world.setStorm(true);
        player.world.setThundering(true);
        player.world.setThunderDuration(1000);
        player.sendMessage('Set weather to stormy!');
    });
registerCommand({
    name: 'tweather',
    usage: '\xA7e/<command>',
    description: 'Brings up a UI to change the weather.',
    aliases: ['tw']
}, function(sender, label, args) {
    assert(sender.hasPermission('thiq.weather'), consts.defaultPermissionMessage);
    if (!isPlayer(sender)) {
        console.log('\xA7cOnly a player can call tweather!');
        return;
    }
    weatherGui.open(sender);
});