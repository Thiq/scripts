var Title = require('titles');
var greetingsTitle = new Title('Hello!');

registerEvent(player, 'join', function(e) {
	greetingsTitle.send(e.getPlayer());
});