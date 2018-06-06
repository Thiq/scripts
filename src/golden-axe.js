var Material = require('@org.bukkit.Material');
var BlockFace = require('@org.bukkit.block.BlockFace');
var assert = require('assert');

eventHandler('block', 'break', function(e) {
    if (!assert(e.getPlayer().hasPermission('thiq.utils.golden_axe'))) return;
    var b = e.getBlock();
    var itemInHand = e.getPlayer().getInventory().getItemInHand();
    if (itemInHand.type != Material.GOLD_AXE) return;
    breakTreeBlock(b);
});

// this function assumes the passed block was broken
function breakTreeBlock(b) {
    var blocks = [
        b.getRelative(BlockFace.NORTH),
        b.getRelative(BlockFace.WEST),
        b.getRelative(BlockFace.SOUTH),
        b.getRelative(BlockFace.EAST),
        b.getRelative(BlockFace.UP),
        b.getRelative(BlockFace.DOWN)
    ];
    for (var i = 0; i < blocks.length; i++) {
        var block = blocks[i];
        if (block.type == Material.LOG || block.type == Material.LEAVES) {
            block.breakNaturally();
            breakTreeBlock(block);
        }
    }
}
