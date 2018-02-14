exports.get = function(c) {
	var version = exports.getVersion();
    var namespace = "net.minecraft.server.";
    if (!c) return namespace + version;
    else return Java.type(namespace + version + '.' + c);
}

exports.getCb = function(c) {
	var version = exports.getVersion();
    var namespace = "org.bukkit.craftbukkit.";
    if (!c) return namespace + version;
    else return Java.type(namespace + version + '.' + c);
}

exports.sendPacket = function(player, packet) {
	var handle = player.getHandle();
	var connection = handle.playerConnection;
	connection.sendPacket(packet);
}

exports.getVersion = function() {
	return Bukkit.getServer().getClass().getPackage().getName().split('.')[3];
}