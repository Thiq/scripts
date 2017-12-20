// An example of using the GUI to control weather.
var Gui = require('gui');
var weatherGui = new Gui();
weatherGui.setTitle('Weather Master');
weatherGui.add(itemStack(160, 1, 4), { name: '\xA7eSunny' },
    function(player) {
        player.world.setStorm(false);
        player.sendMessage('Set weather to sunny!');
        weatherGui.close(player);
    });
weatherGui.add(itemStack(160, 1, 3), { name: '\xA7bLight rain' },
    function(player) {
        player.world.setStorm(true);
        player.world.setThundering(false);
        player.sendMessage('Set weather to light rain!');
        weatherGui.close(player);
    });
weatherGui.add(itemStack(160, 1, 11), { name: '\xA79Stormy' },
    function(player) {
        player.world.setStorm(true);
        player.world.setThundering(true);
        player.world.setThunderDuration(1000);
        player.sendMessage('Set weather to stormy!');
        weatherGui.close(player);
    });
registerCommand({
    name: 'tweather',
    usage: '\xA7e/<command>',
    permission: registerPermission('thiq.weather', 'op'),
    permissionMessage: "\xA7cYou don't have permission to use this!",
    description: 'Brings up a UI to change the weather.',
    aliases: ['tw']
}, function(sender, label, args) {
    if (!isPlayer(sender)) {
        console.log('\xA7cOnly a player can call tweather!');
        return;
    }
    weatherGui.open(sender);
});
