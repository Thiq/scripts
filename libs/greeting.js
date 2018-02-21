var keycard = require('./keycard');

eventHandler('player', 'join', function(e) {
    var key = new keycard.Keycard();
    e.getPlayer().getInventory().addItem(key.getItemStack());
});

eventHandler('player', 'quit', function(e) {
    
});