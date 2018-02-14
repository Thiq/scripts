var isRunning = false;
var watched = [];
var index = 0;

exports.start = function() {
    isRunning = true;
    runUpdate();
}

exports.stop = function() {
    isRunning = false;
}

exports.watch = function(target) {
    if (target.update == undefined) throw new Error(target.toString() + ' does not implement .update()');
    else watched.push(target);
}

exports.destroy = function(target) {
    watched.splice(watched.indexOf(target), 1);
}

function runUpdate() {
    var w = watched.slice(0);
    if (isRunning == false) return;
    if (w.length == 0) {
        Bukkit.getScheduler().runTaskLater(getPlugin(), function() {
            runUpdate();
        }, 10);
    }
    else {
        Bukkit.getScheduler().scheduleAsyncDelayedTask(getPlugin(), function() {
            w[index].update();
                if (index == w.length - 1) index = 0;
                else index++;
            
            runUpdate();
        }, 5);
    }
}

exports.watched = watched;