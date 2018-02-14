var Thread = require('@java.lang.Thread');
var Runnable = require('@java.lang.Runnable');
var Bukkit = require('@org.bukkit.Bukkit');

var scheduler = Bukkit.getScheduler();
var plugin = Bukkit.getPluginManager().getPlugin('Thiq');

var runnable = function(fn) {
    return new Runnable({
        run: fn
    });
};

function async(fn, callback) {
    return scheduler.runTaskAsynchronously(getPlugin(), runnable(function() {
        var result;
        var error;
        try {
            if (typeof(fn) == 'string') {
                result = load(fn);
            } else {
                result = fn();
            }
        } catch (err) {
            error = err;
        }
        if (callback) {
            callback(result, error);
        }
    }));
}

module.exports = async;