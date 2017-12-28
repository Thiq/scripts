(function() {
    var storedLocations = {};

    registerEvent(entity, 'death', function(event) {
        log(event.getEntity().class);
        if (event.getEntity().hasAI() === false) {
            storedLocations[event.getEntity().getUniqueId()] = event.getEntity().getLocation();
        }
    });

    registerCommand({
        name: 'tpback',
        usage: '\xA7e/<command>',
        permission: registerPermission('thiq.tpback', true),
        permissionMessage: '\xA7cYou don\'t have permission to use that!',
        description: 'Teleports a player back to their death point.'
    }, function(sender, label, args) {
        if (storedLocations[sender.getUniqueId()] == undefined) {
            sender.sendMessage('You have no stored death points!');
        } else {
            sender.teleport(storedLocations[sender.getUniqueId()]);
        }
    })
})();