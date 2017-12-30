var Title = require('titles');
var title = new Title().color('blue').stay(500);

registerEvent(player, 'chat', function(e) {
    doMention(e);
});

function doMention(e) {
    if (/\s\@\S\w/i.test(e.getMessage())) {
        var targets = e.getMessage().split(/\s\@\S\w/i);
        for (var i = 0; i < targets.length; i++) {
            var name = targets[i].split(' ')[0];
            var player = Bukkit.getPlayer(name.substring(1));
            var sentBy = e.getPlayer().getPlayerListName();
            title.title(sentBy + ' mentioned you');
            title.send(player);
        }
    } else if (/^\@\S\w/i.test(e.getMessage())) {
        var targets = e.getMessage().split(/\s\@\S\w/i);
        for (var i = 0; i < targets.length; i++) {
            var name = targets[i].split(' ')[0];
            var player = Bukkit.getPlayer(name.split('@')[0]);
            var sentBy = e.getPlayer().getPlayerListName();
            title.title(sentBy + ' mentioned you');
            title.send(player);
        }
    }
}