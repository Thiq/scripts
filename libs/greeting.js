var Title = require('titles').Title;
var greetingsTitle = new Title('Welcome!');

registerEvent(player, 'join', function(e) {
	greetingsTitle.send(e.getPlayer());
});