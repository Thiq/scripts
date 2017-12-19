var enderChest = require('ender-chest');
var Material = require('@org.bukkit.Material');

var lightsTable = enderChest.getTable('nightLights');
var registeredLights = lightsTable.get('lights') || [];
var worldStatus = {};

function NightLight(position, world) {
    return {
        position: position,
        world: world
    }
}

registerCommand({
    name: 'nightlight',
    usage: '\xA7c/<command>',
    permission: registerPermission('thiq.nightlight', false),
    permissionMessage: defaultPermissionMessage,
    aliases: ['nl']
}, function(sender, label, args) {
    var target = sender.getTargetBlock(null, 10);
    if (target.type != Material.REDSTONE_LAMP_OFF && target.type != Material.REDSTONE_LAMP_ON) {
        sender.sendMessage('\xA7cInvalid nightlight. Please target a redstone lamp.');
        return;
    }
    var location = target.getLocation();
    var nightLightPosition = { x: location.x, y: location.y, z: location.z };
    var world = location.world.getName();
    registeredLights.push(new NightLight(nightLightPosition, world));
    lightsTable.set('lights', registeredLights);
    sender.sendMessage('Successfully added nightlight!');
});

// the main issue here is that after each tick, the block reupdates the redstone calls so it's
// immediately powered off. We need to make a way to have the redstone block appear during the toggle
// and then remove it once it's powered for the next update.

setInterval(function() {
    var worlds = Bukkit.getWorlds();
    for (var i = 0; i < worlds.length; i++) {
        var world = worlds[i];
        var status = worldStatus[world.getName()] == true; // just so references don't get copied. Can never be too careful with JS.
        if (world.getTime() >= 14000) {
            // night time
            worldStatus[world.getName()] = true;
        } else {
            worldStatus[world.getName()] = false;
        }
        if (status != worldStatus[world.getName()]) {
            toggleLightsInWorld(world, world.getTime() >= 14000);
        }
    }
}, 50);

function toggleLightsInWorld(world, turnOn) {
    for (var i = 0; i < registeredLights.length; i++) {
        var light = registeredLights[i];
        if (light.world != world.getName()) continue;
        var block = world.getBlockAt(light.x, light.y, light.z).getState();
        block.setType(turnOn ? Material.REDSTONE_LAMP_ON : Material.REDSTONE_LAMP_OFF);
        block.update();
    }
}
