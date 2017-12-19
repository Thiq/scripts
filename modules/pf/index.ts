import * as fs from 'fs';
import * as path from 'path';

let cachedProfiles : any = {};
let profileDir : string;

export class Profile {
	_uuid: string;
	_tables: any;

	constructor(uuid: string) {
		this._uuid = uuid;
	}

	set(table: string, property: string, value: any) {
		if (!this._tables[table]) {
			this._tables = {};
		} 
		this._tables[table] = {};
		this._tables[table][property] = value;
		// save the profile
		this.save();
	}

	get(table: string, property: string) : any {
		if (!this._tables[table]) {
			return undefined;
		} else {
			return this._tables[table][property];
		}
	}

	save() {
		saveProfile(this);
	}

	load() {
		var self = loadProfile(this._uuid);
		this._tables = self._tables;
		return this;
	}
}

export function loadProfile(uuid: string) : Profile {
	if (!cachedProfiles[uuid]) {
		var path = getPathFor(uuid);
		var profile = new Profile(uuid);
		profile._tables = JSON.parse(fs.readFileSync(path));
		cachedProfiles[uuid] = profile;
	}
	return cachedProfiles[uuid];
}

export function saveProfile(profile: Profile) {
	var path = getPathFor(profile._uuid);
	cachedProfiles[profile._uuid] = profile;
	fs.writeFile(path, profile._tables);
}

export function initialize(dir) {
	profileDir = dir || './cached_profiles/';
	fs.mkdir(profileDir, null, function() {
		var onlinePlayers = Bukkit.getOnlinePlayers();
		for (let i = 0; i < onlinePlayers.length; i++) {
			var player = onlinePlayers[i];
			loadProfile(player.getUniqueId());
		}
	});
}

function getPathFor(uuid: string) {
	return path.resolve([profileDir, uuid + '.json']);
}