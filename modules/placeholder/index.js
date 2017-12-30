module.exports = function() {
	var input = arguments[0];
	if (!input) return undefined;
	var subargs = Array.prototype.slice.call(arguments, 1);
	for (var i = 0; i < subargs.length; i++) {
		input = input.replace('${' + i + '}', subargs[i]);
	}
	return input;
}