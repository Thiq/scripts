var Title = require('titles').ActionBarTitle;
var title = new Title().stay(500);
var pf = require('pf');

registerEvent(player, 'chat', function(e) {
    doMention(e);
});

function doMention(e) {
    if (/\s\@\S/i.test(e.getMessage())) {
        var targets = e.getMessage().split(/\s\@\S/i);
        notifyPlayers(e, targets);
    } else if (/^\@\S/i.test(e.getMessage())) {
        var targets = e.getMessage().split(/\s\@\S/i);
        notifyPlayers(e, targets);
    }
}

function notifyPlayers(e, targets) {
    for (var i = 0; i < targets.length; i++) {
        var name = targets[i].split(' ')[0];
        var player = Bukkit.getPlayer(name.split('@')[1]);
        if (player == null) continue;
        if (!hasNotificationsEnabled(player)) continue;
        var sentBy = e.getPlayer().getPlayerListName();
        title.title(sentBy + ' mentioned you');
        title.send(player);
    }
}

function hasNotificationsEnabled(player) {
    var profile = pf.getProfile(player.getUniqueId());
    if (profile.get('mentions', 'isEnabled') === true || !profile.get('mentions')) {
        return true;
    } else {
        return false;
    }
}

registerCommand({
    name: 'mentions',
    description: 'Manages player mention notifications',
    usage: '\xA7eUsage: /mentions [on|off]'
}, function(sender, label, args) {
    if (!args || args.length == 0) {
        sender.sendMessage('Incorrect usage: /mentions [on|off]');
        return;
    }
    if (!isPlayer(sender)) {
        sender.sendMessage('Only players can call mentions');
        return;
    }
    pf.getProfile(sender.getUniqueId()).set('mentions', args[0].toLowerCase() == 'on');
});