import * as updater from 'entity-updater';
import * as nms from 'nms';
import * as math from '@java.lang.Math';

const MoveType = nms.get('EnumMoveType');

class Mount {
    entityType;
    entity;
    player;

    constructor(entityType, player) {
        this.entityType = entityType;
        this.player = player;
    }

    spawn() {
        var world = this.player.world;
        var location = this.player.location;
        this.entity = world.spawn(location, this.entityType, (e) => {
            if (e.hasAI != undefined) {
                e.setAI(false);
                e.setSilent(true);
            }
            e.addPassenger(this.player);
        });
    }

    update() {
        if (this.entity == null) return;
        moveDragon(this.player, this.entity);
        if (this.entity.isEmpty()) {
            this.entity.remove();
            updater.destroy(this);
        }
    }
}

registerCommand({
    name: 'mount',
    usage: '\xA7e/command <type>',
    description: 'Spawns a mount for the player',
    permission: registerPermission('thiq.mount', true),
    permissionMessage: consts.defaultPermissionMessage
}, (sender, label, args) => {
    var mount = new Mount(org.bukkit.entity.EnderDragon.class, sender);
    mount.spawn();
});

// fix this. this shit broken as fuck. Causes huge amounts of freezing. Consider using UltraCosmetics?
function moveDragon(player, dragon) {
    var handle = dragon.getHandle();
    handle.hurtTicks = -1;
    handle.move(MoveType.SELF, dragon.location.getX() + 0.01, dragon.location.getY(), dragon.location.getZ());
    console.log("moved dragon");
}