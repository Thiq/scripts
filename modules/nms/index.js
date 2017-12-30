exports.get = function(c) {
	var version = Bukkit.getServer().getClass().getPackage().getName().split('.')[3];
    var namespace = "net.minecraft.server.";
    if (!c) return namespace + version;
    else return Java.type(namespace + version + '.' + c);
}

exports.sendPacket = function(player, packet) {
	var handle = player.getHandle();
	var connection = handle.playerConnection;
	connection.sendPacket(packet);
}