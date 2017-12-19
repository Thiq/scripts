function Version(args) {
	this.major = 0;
	this.minor = 0;
	this.sub = 0;
	this.modifiers = '';

	if (!args || args.length == 0) return this;
	if (typeof args == 'string') {
		var argsArray = args.split('.');
		this.major = parseInt(args[0]);
		this.minor = parseInt(args[1]);
		this.sub = parseInt(args[2].split(/\+\=\-\<\>\?/)[0]);
		this.modifiers = args[2].split(/\+\=\-\<\>\?/)[1];
	} else if (typeof args == 'Array') {
		this.major = parseInt(args[0]);
		this.minor = parseInt(args[1]);
		this.sub = parseInt(args[2]);
		this.modifiers = args[3];
	}

	return this;
}
