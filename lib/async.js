// this is Spigot specific. I'd like to find a way to do it without Spigot so we can use it
// across any JVM application. So basically don't use this if not in Spigot.

var Thread = require('@java.lang.Thread');
var Runnable = require('@java.lang.Runnable');
var Bukkit = require('@org.bukkit.Bukkit');

var scheduler = Bukkit.getScheduler();

var runnable = function(fn) {
    return new Runnable({
        run: fn
    });
};

function async(fn, callback) {
    return scheduler.runTaskAsynchronously(plugin, runnable(function() {
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