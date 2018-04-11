const QuestType = require('./types').QuestType;
const _ = require('underscore');

function getNPCRegistry() {
    return getPlugin('Citizens').getNPCRegistry();
}

function getNPCSpeech() {
    return getPlugin('Citizens').getSpeechFactory();
}

/**
 * A target for a quest.
 * 
 * @param {TargetType} type 
 * @param {any} data 
 */
function QuestTarget(type, data) {
    this.type = type;
    switch(type) {
        case TargetType.ENTITY:
        case TargetType["0"]:
            this.data = getNPCRegistry().getNPC(data).getUniqueId().toString();
            break;
        case TargetType.BLOCK:
        case TargetType["1"]:
            if (data instanceof String) {
                var id = data.split(':')[0].replace('-', '_').toUpperCase();
                var md = partInt(data.split(':')[1]);
                this.data = { type: id, data: md == NaN ? 0 : md };
            } else if (data instanceof org.bukkit.block.Block) {
                this.data = { type: data.type, data: data.data || 0 };
            } else {
                this.data = data;
            }
            break;
        case TargetType.ITEM:
        case TargetType["2"]:
            if (data instanceof String) {
                var id = data.split(':')[0].replace('-', '_').toUpperCase();
                var md = parseInt(data.split(':')[1]);
                this.data = itemStack({ type: org.bukkit.Material.getMaterial(id), data: md == NaN ? 0 : md });
            } else if (data instanceof org.bukkit.inventory.ItemStack) {
                this.data = data; // TODO: figure out how to serialize this
            } else {
                this.data = data;
            }
            break;
    }
}


QuestTarget.prototype.isEqual = function(target) {
    if (!target) return false;
    if (target === true) return true;
    switch(this.type) {
        case TargetType.ENTITY:
        case TargetType["0"]:
            return getNPCRegistry().getNPC(target).getUniqueId().toString() == this.data;
        case TargetType.BLOCK:
        case TargetType["1"]:
        case TargetType.ITEM:
        case TargetType["2"]:
            return this.data.type == targetType.type && (this.data.data || 0) == (target.data || 0);
        default:
            return false;
    }
}

exports.QuestTarget = QuestTarget;

const TargetType = {
    ENTITY: 0,
    BLOCK: 1,
    ITEM: 2,
    0: 'ENTITY',
    1: 'BLOCK',
    2: 'ITEM'
}

exports.TargetType = TargetType;