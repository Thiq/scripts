var Title = require('titles').ActionBarTitle;
var title = new Title().stay(500);
var pf = require('pf');
var assert = require('assert');
var consts = require('./consts');

eventHandler('player', 'chat', function(e) {
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
        player.playNote(player.getLocation(), org.bukkit.Instrument.CHIME, org.bukkit.Note.natural(1, (org.bukkit.Note.Tone.C)));
    }
}

function hasNotificationsEnabled(player) {
    var profile = pf.getProfile(player.getUniqueId());
    return profile.get('mentions', 'isEnabled') === true;
}

registerCommand({
    name: 'mentions',
    description: 'Manages player mention notifications',
    usage: '\xA7eUsage: /<command> [on|off]'
}, function(sender, label, args) {
    assert(sender.hasPermission("thiq.mentions.toggle"), consts.defaultPermissionMessage);
    if (!args || args.length == 0) {
        return false;
    }
    if (!isPlayer(sender)) {
        sender.sendMessage('Only players can call mentions');
        return;
    }
    var turnOn = args[0].toLowerCase() == 'on';
    pf.getProfile(sender.getUniqueId()).set('mentions', 'isEnabled', turnOn);
    sender.sendMessage('\xA7eTurned notifications ' + (turnOn ? 'on' : 'off'));
    return true;
});