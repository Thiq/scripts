registerCommand({
    name: 'cleane',
    usage: '\xA7c/<command>',
    permission: registerPermission('thiq.admin.cleane', 'op'),
    permissionMessage: '\xA7cYou don\'t have permission to use that!'
}, function(sender, label, args) {
    sender.getWorld().getEntities().forEach(function(entity) {
        if (entity.isVisible() === false && entity.getPassengers().length === 0) {
            log('Removing entity with UUID ' + entity.getUniqueId());
            entity.remove();
        }
    });
});