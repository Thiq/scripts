var keycard = require('./keycard');

registerEvent(player, 'join', function(e) {
    var key = new keycard.Keycard();
    e.getPlayer().getInventory().addItem(key.getItemStack());
});

registerEvent(player, 'quit', function(e) {
    
});