var Action = require('@org.bukkit.event.block.Action');
var Material = require('@org.bukkit.Material');
var BlockFace = require('@org.bukkit.block.BlockFace');

var registeredChairs = [];
registerEvent(player, 'interact', function(event) {
    if (event.action != Action.RIGHT_CLICK_BLOCK ||
        event.player.getInventory().getItemInMainHand().type != Material.AIR ||
        !isChair(event.getClickedBlock()))
        return;
    event.cancelled = true;
    var target = event.player.getTargetBlock(null, 10);
    var oldLocation = event.player.getLocation();
    location = new org.bukkit.Location(event.player.world, target.x + 0.5, target.y - 1, target.z + 0.5);
    var en = event.player.world.spawn(location, org.bukkit.entity.ArmorStand.class, function(e) {
        e.setSilent(true);
        e.setVisible(false);
        e.setGravity(false);
    });
    en.addPassenger(event.player);
    doChairUpdate(event, oldLocation, en);
});

function doChairUpdate(event, oldLocation, en) {
    setTimeout(function() {
        if (en.getPassengers().length == 0) {
            event.player.teleport(oldLocation);
            en.remove();
        } else {
            doChairUpdate(event, oldLocation, en);
        }
    }, 500);
}

var chairBlocks = [
    Material.WOOD_STAIRS,
    Material.SPRUCE_WOOD_STAIRS,
    Material.ACACIA_STAIRS,
    Material.BIRCH_WOOD_STAIRS,
    Material.DARK_OAK_STAIRS,
    Material.JUNGLE_WOOD_STAIRS,
    Material.NETHER_BRICK_STAIRS,
    Material.PURPUR_STAIRS,
    Material.RED_SANDSTONE_STAIRS,
    Material.SANDSTONE_STAIRS,
    Material.SMOOTH_STAIRS,
    Material.COBBLESTONE_STAIRS,
    Material.BRICK_STAIRS
];

function isChair(block) {
    if (chairBlocks.indexOf(block.type) == -1) return false;
    if (block.getRelative(BlockFace.BOTTOM).type == Material.DIAMOND_BLOCK) return true;
    var facing = block.getState().getData().getFacing();
    if (facing == BlockFace.NORTH || facing == BlockFace.SOUTH) {
        // check all blocks from west to east
        var lastCheck = block;
        var hasReachedLeftEnd = false;
        var hasReachedRightEnd = false;
        for (var i = 0; i < 10; i++) {
            if (hasReachedLeftEnd) continue;
            lastCheck = lastCheck.getRelative(BlockFace.WEST);
            if (lastCheck.type == Material.WALL_SIGN) {
                hasReachedLeftEnd = true;
            } else if (chairBlocks.indexOf(lastCheck.type) == -1 || lastCheck.getState().getData().getFacing() != facing) {
                return false;
            }
        }
        lastCheck = block;
        for (var i = 0; i < 10; i++) {
            if (hasReachedRightEnd) continue;
            lastCheck = lastCheck.getRelative(BlockFace.EAST);
            if (lastCheck.type == Material.WALL_SIGN) {
                hasReachedRightEnd = true;
            } else if (chairBlocks.indexOf(lastCheck.type) == -1 || lastCheck.getState().getData().getFacing() != facing) {
                return false;
            }
        }
        return hasReachedRightEnd && hasReachedLeftEnd;
    } else {
        var lastCheck = block;
        var hasReachedLeftEnd = false;
        var hasReachedRightEnd = false;
        for (var i = 0; i < 10; i++) {
            if (hasReachedLeftEnd) continue;
            lastCheck = lastCheck.getRelative(BlockFace.NORTH);
            if (lastCheck.type == Material.WALL_SIGN) {
                hasReachedLeftEnd = true;
            } else if (chairBlocks.indexOf(lastCheck.type) == -1 || lastCheck.getState().getData().getFacing() != facing) {
                return false;
            }
        }
        lastCheck = block;
        for (var i = 0; i < 10; i++) {
            if (hasReachedRightEnd) continue;
            lastCheck = lastCheck.getRelative(BlockFace.SOUTH);
            if (lastCheck.type == Material.WALL_SIGN) {
                hasReachedRightEnd = true;
            } else if (chairBlocks.indexOf(lastCheck.type) == -1 || lastCheck.getState().getData().getFacing() != facing) {
                return false;
            }
        }

        return hasReachedLeftEnd && hasReachedRightEnd;
    }
}
