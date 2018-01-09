var wg = require('wg');
var ender = require('ender-chest').getTable('wg-meta');

/**
 * Creates a new WgMeta object.
 * @param {string} regionId The ID of the WorldGuard region.
 */
function WgMeta(regionId) {
    this.metadata = ender.get(regionId) || {};
    this.regionId = regionId;
}

/**
 * Gets a value from the metadata table of the region.
 * @param {string} key The property key.
 */
WgMeta.prototype.get = function(key) {
    if (!this.metadata[key]) {
        this.metadata[key] = ender.get(this.regionId)[key];
    }
    return this.metadata[key];
};

/**
 * Sets a value in the metadata table then saves.
 * @param {string} key 
 * @param {*} value 
 */
WgMeta.prototype.set = function(key, value) {
    this.metadata[key] = value;
    ender.set(this.regionId, this.metadata);
};

/**
 * Clones the metadata table of a region into another.
 * @param {string} regionId The clones region ID.
 */
WgMeta.prototype.cloneTo = function(regionId) {
    var clone = new WgMeta(regionId);
    clone.metadata = this.metadata;
    return clone;
};

exports.WgMetadataTable = WgMeta;