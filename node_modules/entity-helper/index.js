exports.move = function(entity, to) {
    var handle = entity.getHandle();
    if (handle.getNavigation == undefined) throw new Error('Entity is not sentient. Cannot move.');
    handle.getNavigation().a(2);
    var path = handle.getNavigation().a(to.getX(), to.getY(), to.getZ());
    if (path != null) {
        handle.getNavigation().a(path, 1.05);
        handle.getNavigation().a(1.05);
    }
}

exports.follow = function(toFollow, follower) {
    var target = toFollow.getLocation();
    exports.move(follower, target);
}