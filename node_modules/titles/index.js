const p = require('placeholder');
const ChatColor = require('@org.bukkit.ChatColor');
const nms = require('nms');
const String = require('@java.lang.String');

function Title(header, sub) {
    this._header = header;
    this._sub = sub;
}

Title.prototype.title = function(input) {
    if (!input) return this._header;
    this._header = input;
    return this;
}

Title.prototype.subtitle = function(input) {
    if (!input) return this._sub;
    this._sub = input;
    return this;
}

Title.prototype.color = function(input) {
    if (!input) return this._color;
    this._color = input;
    return this;
}

Title.prototype.subColor = function(input) {
    if (!input) return this._subColor;
    this._subColor = input;
    return this;
}

Title.prototype.fadeIn = function(input) {
    if (!input) return this._fadeIn;
    this._fadeIn = input;
    return this;
}

Title.prototype.subFadeIn = function(input) {
    if (!input) return this._subFadeIn;
    this._subFadeIn = input;
    return this;
}

Title.prototype.stay = function(input) {
    if (!input) return this._stay;
    this._stay = input;
    return this;
}

Title.prototype.subStay = function(input) {
    if (!input) return this._subStay;
    this._subStay = input;
    return this;
}

Title.prototype.fadeOut = function(input) {
    if (!input) return this._fadeOut;
    this._fadeOut = input;
    return this;
}

Title.prototype.subFadeOut = function(input) {
    if (!input) return this._subFadeOut;
    this._subFadeOut = input;
    return this;
}

Title.prototype.send = function(player) {
    // Don't try this at home, kids!
	var tjson = '{ "text": "${0}", "color": "${1}" }';
	var titleText = p(tjson, this.title(), this._color.toLowerCase());
	var subText = p(tjson, this.subtitle(), this.subColor().toLowerCase());
	var chatTitle = nms.get('IChatBaseComponent').class.getDeclaredClasses()[0].getMethod('a', String.class).invoke(null, titleText);
	var chatSub = nms.get('IChatBaseComponent').class.getDeclaredClasses()[0].getMethod('a', String.class).invoke(null, subText);
	var Packet = nms.get('PacketPlayOutTitle');
	var titlePacket = new Packet(Packet.EnumTitleAction.TITLE, chatTitle, this.fadeIn(), this.stay(), this.fadeOut());
	nms.sendPacket(player, titlePacket);
		
	if (this.subtitle() != undefined && this.subtitle().length > 0) {
		var subPacket = new Packet(Packet.EnumTitleAction.SUBTITLE, chatSub, this.subFadeIn() || this.fadeIn(), this.subStay() || this.stay(), this.subFadeOut() || this.fadeOut());
		nms.sendPacket(player, subPacket);
	}
}

Title.prototype.sendAll = function() {
    let players = Bukkit.getOnlinePlayers();
    for (let i = 0; i < players.length; i++) {
        this.send(players[i]);
    }
}

exports.Title = Title;

function ActionBarTitle(text) {
    this.text = text;
    this._color = 'white';
    this._fadeIn = 50;
    this._stay = 2000;
    this._fadeOut = undefined;
}

ActionBarTitle.prototype.title = function(input) {
    if (!input) return this.text;
    this.text = input;
    return this;
}

ActionBarTitle.prototype.color = function(input) {
    if (!input) return this._color;
    this._color = input;
    return this;
}

ActionBarTitle.prototype.fadeIn = function(input) {
    if (!input) return this._fadeIn;
    this._fadeIn = input;
    return this;
}

ActionBarTitle.prototype.stay = function(input) {
    if (!input) return this._stay;
    this._stay = input;
    return this;
}

ActionBarTitle.prototype.fadeOut = function(input) {
    if (!input) return this._fadeOut;
    this._fadeOut = input;
    return this;
}

ActionBarTitle.prototype.send = function(player) {
    var tjson = '{ "text": "${0}", "color": "${1}" }';
	var titleText = p(tjson, this.text, this._color.toLowerCase());
	var chatTitle = nms.get('IChatBaseComponent').class.getDeclaredClasses()[0].getMethod('a', String.class).invoke(null, titleText);
	var Packet = nms.get('PacketPlayOutTitle');
	var titlePacket = new Packet(Packet.EnumTitleAction.ACTIONBAR, chatTitle, this._fadeIn, this._stay, this._fadeOut);
	nms.sendPacket(player, titlePacket);
}

exports.ActionBarTitle = ActionBarTitle;

