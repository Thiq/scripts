/*
Module for loading player profiles and keeping them persisted, acting as the boilerplate code 
for any plugins that require a player profile.
*/

var cachedProfiles = {};
var fs = require('fs');
var path = require('path');
var cacheDirectory;

function Profile(uuid, tables) {
	this._uuid = uuid;
	this._tables = tables || {};
}

Profile.prototype.set = function(table, property, value) {
	if (!this._tables[table]) {
			createTableForProfile(this._uuid, table);
			this._tables[table] = {};
		}
		this._tables[table][property] = value;
		saveProfileFor(this._uuid);
}

Profile.prototype.get = function(table, property) {
	if (!this._tables[table]) {
			return undefined;
		}
		return this._tables[table][property];
}

function loadProfileFor(uuid) {
	if (!cachedProfiles[uuid]) {
		// load from config file
		var filePath = path.resolve([cacheDirectory, uuid + '.json']);
		var tables;
		if (fs.exists(filePath)) {
			tables = fs.readfileSync(filePath);
		}
		var profile = new Profile(uuid, tables);
		cachedProfiles[uuid] = profile;
	}
	return cachedProfiles[uuid];
}

function saveProfileFor(uuid) {
	var filePath = path.resolve([cacheDirectory, uuid + '.json']);
	if (!cachedProfiles[uuid]) {
		// load from config file
		var tables;
		if (fs.exists(filePath)) {
			tables = fs.readfileSync(filePath);
		}
		var profile = new Profile(uuid, tables);
		cachedProfiles[uuid] = profile;
	}
	fs.writeFile(filePath, cachedProfiles[uuid]._tables.toString());
}

function initialize(dir) {
	cacheDirectory = dir || './cached_profiles/';
	fs.mkdir(cacheDirectory, null, function() {
	var onlinePlayers = Bukkit.getOnlinePlayers();
		for (var i = 0; i < onlinePlayers.length; i++) {
			var player = onlinePlayers[i];
			loadProfileFor(player.getUniqueId());
		}
	});
}

exports.getProfile = loadProfileFor;
exports.initialize = initialize;