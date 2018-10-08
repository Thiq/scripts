var Material = require('@org.bukkit.Material');
var BlockFace = require('@org.bukkit.block.BlockFace');

eventHandler('item', 'spawn', function(event) {
    var entity = event.getEntity();
    var loc = entity.getLocation();
    // here we do a quick check to see if anything under it is a hopper
    var breakLocation = entity.getWorld().getBlockAt(location);
    for (var i = 0; i < 128; ++i) {
        var relative = breakLocation.getRelative(BlockFace.DOWN, i);
        if (relative.getType() === Material.HOPPER) {
            // cancel the spawn and add it to the hopper
            var hopper = relative.getState();
            hopper.getInventory().addItem(entity.getItemStack());
            event.setCancelled(true);
            break;
        }
    }
});