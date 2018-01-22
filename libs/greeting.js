var keycard = require('./libs/keycard');

registerEvent(player, 'join', function(e) {
    var key = new keycard.Keycard();
    e.getPlayer().getInventory().addItem(key.stack);
});

registerEvent(player, 'quit', function(e) {
    
});