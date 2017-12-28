var Action = require('@org.bukkit.event.block.Action');
var Material = require('@org.bukkit.Material');

registerEvent(player, 'interact', function(event) {
    if (event.action != Action.RIGHT_CLICK_BLOCK) return;
    if (event.getClickedBlock().type != Material.SIGN && event.getClickedBlock().type != Material.WALL_SIGN && event.getClickedBlock().type != Material.SIGN_POST) return;
    var lines = event.getClickedBlock().getState().getLines();
    var cmd = '';
    if (!lines[0].startsWith('/')) return false;
    for (var i = 0; i < lines.length; i++) {
        cmd += lines[i];
    }
    Bukkit.dispatchCommand(event.getPlayer(), cmd.substring(1));
});