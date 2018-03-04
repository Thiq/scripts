eventHandler('server', 'pluginEnable', function(e) {
    if (e.plugin != getPlugin('Citizens')) return;
    var cEvent = net.citizensnpcs.api.event;
    var CitizensListener = registerNewListener('citizens', {
        deserializeMeta: cEvent.CitizensDeserialiseMetaEvent,
        disable: cEvent.CitizensDisableEvent,
        enable: cEvent.CitizensEnableEvent,
        preReload: cEvent.CitizensPreReloadEvent,
        reload: cEvent.CitizensReloadEvent,
        serializeMeta: cEvent.CitizensSerialiseMetaEvent,
        commandSenderCreateNPC: cEvent.CommandSenderCreateNPCEvent,
        entityTargetNPC: cEvent.EntityTargetNPCEvent,
        //addTrait: cEvent.NPCAddTraitEvent,
        click: cEvent.NPCClickEvent,
        collision: cEvent.NPCCollisionEvent,
        combustByBlock: cEvent.NPCCombustByBlockEvent,
        combustByEntity: cEvent.NPCCombustByEntityEvent,
        combust: cEvent.NPCCombustEvent,
        create: cEvent.NPCCreateEvent,
        damageByBlock: cEvent.NPCDamageByBlockEvent,
        damageByEntity: cEvent.NPCDamageByEntityEvent,
        damageEntity: cEvent.NPCDamageEntityEvent,
        damage: cEvent.NPCDamageEvent,
        death: cEvent.NPCDeathEvent,
        despawn: cEvent.NPCDespawnEvent,
        //enderTeleport: cEvent.NPCEnderTeleportEvent,
        leftClick: cEvent.NPCLeftClickEvent,
        push: cEvent.NPCPushEvent,
        remove: cEvent.NPCRemoveEvent,
        //removeTrait: cEvent.NPCRemoveTraitEvent,
        rightClick: cEvent.NPCRightClickEvent,
        select: cEvent.NPCSelectEvent,
        spawn: cEvent.NPCSpawnEvent,
        //teleport: cEvent.NPCTeleportEvent,
        traitCommandAttach: cEvent.NPCTraitCommandAttachEvent,
        playerCreateNPC: cEvent.PlayerCreateNPCEvent
    });
    
});
module.exports = getPlugin('Citizens');