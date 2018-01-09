import { Client } from 'purl';

var httpClient = new Client();

export class VersioningData {
	name: string;
	version: Version;

	constructor(name: string, version: Version) {
		this.name = name;
		this.version = version;
	}
}

// the http client expects a JSON response formed as { name: string, version: { major: int, minor: int, sub: int }, md5: int }
// if these requirements are not met, then it will assume the current version is most-up-to-date
// it returns whether or not the current installed version is valid.
export function verifyVersion(data: VersioningData, url: string): Promise<boolean> {
	return new Promise<bool>((resolve, reject) => {
		httpClient.get(url).then((result) => {
			let json = JSON.parse(result);
			if (!isValidJson(json)) resolve(true);
			let checkedVersion = new Version(json.version);
			if (!data.version.isBefore(checkedVersion)) resolve(true);
			else resolve(false);
		}, (err) => {
			reject(err);
		});
	});
}

function isValidJson(json): boolean {
	if (!json.version.major) return false;
	if (!json.version.minor) return false;
	if (!json.version.sub) return false;
	if (!json.md5) return false;
	return true;
}
