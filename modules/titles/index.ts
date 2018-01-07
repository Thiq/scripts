import * as p from 'placeholder';
import { ChatColor } from '@org.bukkit';
import * as nms from 'nms';
import { String } from '@java.lang';

export class Title {
	_header: string = '';
	_sub: string;
	_color: string = "white";
	_subColor: string = "white";
	_fadeIn: number = 50;
	_subFadeIn: number = 50;
	_stay: number = 2000;
	_subStay: number = undefined;
	_fadeOut: number = undefined;
	_subFadeOut: number = undefined;

	constructor(header?: string, sub?: string) {
		this._header = header;
		this._sub = sub;
	}

	title(input: string) {
		this._header = input;
		return this;
	}

	subtitle(input: string) {
		this._sub = input;
		return this;
	}

	color(input: string) {
		this._color = input;
		return this;
	}

	subColor(input: string) {
		this._subColor = input;
		return this;
	}

	fadeIn(input: number) {
		this._fadeIn = input;
		return this;
	}

	subFadeIn(input: number) {
		this._subFadeIn = input;
		return this;
	}

	stay(input: number) {
		this._stay = input;
		return this;
	}

	subStay(input: number) {
		this._subStay = input;
		return this;
	}

	fadeOut(input: number) {
		this._fadeOut = input;
		return this;
	}

	subFadeOut(input: number) {
		this._subFadeOut = input;
		return this;
	}

	send(player) {
		// Don't try this at home, kids!
		var tjson = '{ "text": "${0}", "color": "${1}" }';
		var titleText = p(tjson, this._header, this._color.toLowerCase());
		var subText = p(tjson, this._sub, this._subColor.toLowerCase());
		var chatTitle = nms.get('IChatBaseComponent').class.getDeclaredClasses()[0].getMethod('a', String.class).invoke(null, titleText);
		var chatSub = nms.get('IChatBaseComponent').class.getDeclaredClasses()[0].getMethod('a', String.class).invoke(null, subText);
		var Packet = nms.get('PacketPlayOutTitle');
		var titlePacket = new Packet(nms.get('PacketPlayOutTitle.EnumTitleAction').TITLE, chatTitle, this._fadeIn, this._stay, this._fadeOut);
		nms.sendPacket(player, titlePacket);
		
		if (this._sub != undefined && this._sub.length > 0) {
			var subPacket = new Packet(nms.get('PacketPlayOutTitle.EnumTitleAction').SUBTITLE, chatSub, this._subFadeIn || this._fadeIn, this._subStay || this._stay, this._subFadeOut || this._fadeOut);
			nms.sendPacket(player, subPacket);
		}
	}

	sendAll() {
		var players = Bukkit.getOnlinePlayers();
		for (let i = 0; i < players.length; i++) {
			this.send(players[i]);
		}
	}
}

export class ActionBarTitle {
	text: string;
	_color: string = "white";
	_fadeIn: number = 50;
	_stay: number = 2000;
	_fadeOut: number = undefined;

	constructor(text: string) {
		this.text = text;
	}

	title(input: string) {
		this.text = input;
		return this;
	}

	color(input: string) {
		this._color = input;
		return this;
	}

	fadeIn(input: number) {
		this._fadeIn = input;
		return this;
	}

	stay(input: number) {
		this._stay = input;
		return this;
	}

	fadeOut(input: number) {
		this._fadeOut = input;
		return this;
	}

	send(player) {
		// Don't try this at home, kids!
		var tjson = '{ "text": "${0}", "color": "${1}" }';
		var titleText = p(tjson, this.text, this._color.toLowerCase());
		var chatTitle = nms.get('IChatBaseComponent').class.getDeclaredClasses()[0].getMethod('a', String.class).invoke(null, titleText);
		var Packet = nms.get('PacketPlayOutTitle');
		var titlePacket = new Packet(nms.get('PacketPlayOutTitle.EnumTitleAction').ACTIONBAR, chatTitle, this._fadeIn, this._stay, this._fadeOut);
		nms.sendPacket(player, titlePacket);
	}

	sendAll() {
		var players = Bukkit.getOnlinePlayers();
		for (let i = 0; i < players.length; i++) {
			this.send(players[i]);
		}
	}
}