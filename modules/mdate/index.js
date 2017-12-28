function MDate() {
    this.year = 0;
    this.month = 0;
    this.day = 1;
    this.hour = 0;
    this.minute = 0;
}

MDate.prototype.years = function(value) {
    if (value != undefined) this.year = value;
    return this.year;
};

MDate.prototype.months = function(value) {
    if (value != undefined) this.month = value;
    return this.month;
};

MDate.prototype.days = function(value) {
    if (value != undefined) this.day = value;
    return this.day;
};

MDate.prototype.hours = function(value) {
    if (value != undefined) this.hour = value;
    return this.hour;
};

MDate.prototype.minutes = function(value) {
    if (value != undefined) this.minute = value;
    return this.value;
};

MDate.prototype.add = function() {
    if (arguments.length == 0) return;
    if (typeof arguments[0] == 'number') {
        // this means we're doing .add(3, 'months|days|seconds')
        if (/^year(s)$/i.test(arguments[1])) {
            this.year += arguments[0];
        } else if (/^month(s)$/i.test(arguments[1])) {
            this.month += arguments[0];
        } else if (/^day(s)$/i.test(arguments[1])) {
            this.days += arguments[0];
        } else if (/^hour(s)$/i.test(arguments[1])) {
            this.hour += arguments[0];
        } else if (/^minute(s)$/i.test(arguments(1))) {
            this.minute += arguments[0];
        }
    } else if (typeof arguments[0] == 'object') {
        var arg = arguments[0];
        this.year += arg.years || 0;
        this.month += arg.months || 0;
        this.day += arg.days || 0;
        this.hour += arg.hours || 0;
        this.minute += arg.minutes || 0;
    }
    return this;
};

MDate.prototype.subtract = function() {
    if (arguments.length == 0) return;
    if (typeof arguments[0] == 'number') {
        // this means we're doing .add(3, 'months|days|seconds')
        if (/^year(s)$/i.test(arguments[1])) {
            this.year -= arguments[0];
        } else if (/^month(s)$/i.test(arguments[1])) {
            this.month -= arguments[0];
        } else if (/^day(s)$/i.test(arguments[1])) {
            this.days -= arguments[0];
        } else if (/^hour(s)$/i.test(arguments[1])) {
            this.hour -= arguments[0];
        } else if (/^minute(s)$/i.test(arguments(1))) {
            this.minute -= arguments[0];
        }
    } else if (typeof arguments[0] == 'object') {
        var arg = arguments[0];
        this.year -= arg.years || 0;
        this.month -= arg.months || 0;
        this.day -= arg.days || 0;
        this.hour -= arg.hours || 0;
        this.minute -= arg.minutes || 0;
    }
    return this;
};

MDate.now = function(world) {
    var date = new MDate();
    // parse ticks to date info
    return date;
};

exports.default = MDate;