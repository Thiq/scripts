// event handler objects
var block = {};
var enchantment = {};
var entity = {};
var inventory = {};
var hanging = {};
var player = {};
var server = {};
var vehicle = {};
var weather = {};
var world = {};
var js = {};

(function() {
    function getHandlerList(eventType) {
        var c = eventType.class;
        var cresult = c.getMethod('getHandlerList').invoke(null);
        return cresult;
    }

    global.registerEvent = function(handler, eventname, callback) {
        callback.cancelToken = new java.lang.Object();
        if (handler[eventname]) {
            handler[eventname].callbacks.splice(0, 0, callback);
        } else {
            handler[eventname] = function(event) {
                var callbacks = handler[eventname].callbacks;
                for (var i = 0; i < callbacks.length; ++i) {
                    try {
                        callbacks[i](event);
                    } catch (ex) {
                        if (event instanceof org.bukkit.event.player.PlayerEvent && typeof(ex) === 'string') {
                            event.player.sendMessage(ex);
                        }
                        log(ex);
                    }
                }
            };
            handler[eventname].callbacks = [];
            handler[eventname].callbacks.push(callback);
        }
        return callback.cancelToken;
    }

    global.unregisterEvent = function(handler, eventname, cancelToken) {
        list = handler[eventname].callbacks;
        for (var i = 0; i < list.length; ++i) {
            if (list[i].cancelToken == cancelToken) {
                list.splice(i, 1);
                return true;
            }
        }
        return false;
    }
})();