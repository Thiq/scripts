var debugMessages = process.config.verbose_logging;

function log(msg, level, verbose) {
    if (verbose && !debugMessages) return;
    if (!level) level = "f";
    if (msg instanceof Array) {
        for (var i in msg) {
            loader.server.consoleSender.sendMessage("\xA7" + level + "[Thiq] " + msg[i]);
        }
    } else {
        loader.server.consoleSender.sendMessage("\xA7" + level + "[Thiq] " + msg);
    }
}

global.console = {
    log: log,
    warning: function (msg, verbose) {
        log(msg, 'd', verbose)
    },
    debug: function (msg, verbose) {
        log(msg, 'a', verbose)
    },
    error: function (msg, verbose) {
        log(msg, 'c', verbose)
    },
    trace: log
};