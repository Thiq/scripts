var enderChest = require('ender-chest');
var table = enderChest.getTable('block_reset');

eventHandler('block', 'physics', function(e) {
    var block = e.block;
    var sign = e.block.getRelative(org.bukkit.block.BlockFace.UP, 0);
    var location = block.getState().getLocation();
    var world = block.getWorld();
    if (sign.type != org.bukkit.Material.SIGN && sign.type != org.bukkit.Material.SIGN_POST && sign.type != org.bukkit.Material.WALL_SIGN) return;
    var signData = sign.getState().getLines();
    if (signData[0].toLowerCase() != '[breset]') return;
    var type = getItemId(signData[1]);
    console.log(org.bukkit.Material[type]);
    var wait = signData[2] || 2; // 2 ticks because 1 can lag out the server if done right
    setTimeout(function() {
        if (world.getBlockAt(location).type == org.bukkit.Material.AIR) {
            world.getBlockAt(location).setType(org.bukkit.Material[type], true);
            console.log('Resetting');
        }
            
    }, wait);
});