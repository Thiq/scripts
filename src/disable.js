// disabled various mechanics within Spigot
var ender = require('ender-chest');
var table = ender.getTable('thiq');

var isEnchantingDisabled = table.get('isEnchantingDisabled') || false;
var isCraftingDisabled = table.get('isCraftingDisabled') || false;
var isSmithingDisabled = table.get('isSmithingDisabled') || false;
var isSmeltingDisabled = table.get('isSmeltingDisabled') || false;

registerCommand({
    name: 'disable',
    usage: '\xA7eUsage: /disable [enchanting|crafting|smithing|smelting]',
    description: 'Disables mechanics within the server.'
}, function(sender, label, args) {
    assert(sender.hasPermission('thiq.disable'), consts.defaultPermissionMessage);
    if (args.length == 0 || !args) {
        throw new Error('Incorrect usage! /disable [enchanting|craft|smithing|smelting]');
    }
    switch (args[0].toLowerCase()) {
        case 'enchanting':
            table.set('isEnchantingDisabled', true);
            break;
        case 'crafting':
            table.set('isCraftingDisabled', true);
            break;
        case 'smithing':
            table.set('isSmithingDisabled', true);
            break;
        case 'smelting':
            table.set('isSmeltingDisabled', true);
            break;
        default:
            throw new Error('Invalid param "' + args[0] + '"');
    }

    sender.sendMessage(args[0] + ' is now disabled.');
});