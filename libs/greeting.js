var titles = require('titles');
var greetingsTitle = new titles.Title('Hello!');

registerEvent(player, 'join', function(e) {
	greetingsTitle.send(e.getPlayer());
});