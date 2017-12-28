// Adds extended functionality to the event handlers within Thiq

exports.registerEventUntil = function(handler, eventname, callback, check) {
    var cancelToken = new java.lang.Object();
    var newFn = function(e) {
        if (!check(e)) {
            unregisterEvent(handler, eventname, cancelToken);
        } else {
            callback(e);
        }
    };
    newFn.cancelToken = cancelToken;
    return registerEvent(handler, eventname, newFn);
};