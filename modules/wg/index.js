var worldguard = require('@com.sk89q.worldguard.bukkit.WorldGuardPlugin');

function WorldGuardWrapper(world) {
    if (typeof world == 'string') {
        world = Bukkit.getWorld(world);
    }
    return worldguard.getRegionManager(world);
}

WorldGuardWrapper.base = worldguard;

module.exports = WorldGuardWrapper;