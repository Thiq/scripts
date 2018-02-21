var ender = require('ender-chest');
var table = ender.getTable('timetracker');

var trackedLogins = {};

var players = Bukkit.getOnlinePlayers();
for (var i = 0; i < players.length; i++) {
	var p = players[i];
	trackedLogins[p.getUniqueId()] = p.getLastPlayed();
}

eventHandler('player', 'join', function(e) {
	trackedLogins[e.getPlayer().getUniqueId()] = e.getPlayer().getLastPlayed();
});

eventHandler('player', 'quit', function(e) {
	savePlayerTime(e.getPlayer());
});

eventHandler('server', 'pluginDisable', function(e) {
	if (e.getPlugin().getName() == 'Thiq') {
		var players = Bukkit.getOnlinePlayers();
		for (var i = 0; i < players.length; i++) {
			savePlayerTime(players[i]);
		}
	}
});

function savePlayerTime(player) {
	var start = trackedLogins[player.getUniqueId()];
	var end = player.getLastPlayed();
	if (end < start) {
		// this means that they played through midnight
		end += 86400000;
	}
	var old = table.get(player.getUniqueId());
	table.set(player.getUniqueId(), old + (end - start));
	trackedLogins[player.getUniqueId()] = undefined;
}