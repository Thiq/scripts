const QuestType = require('./types').QuestType;
const QuestTarget = require('./targets').QuestTarget;
const guid = require('guid');

/**
 * A wrapper around a quest objective.
 * 
 * @param {QuestType} type 
 * @param {QuestTarget} target 
 * @param {Number} id 
 * @param {Number} count 
 * @param {any} location 
 */
function QuestObjective(type, target, id, count, location) {
    this.type = type;
    this.target = target;
    this.id = id;
    this.count = count;
    this.location = location;
}

QuestObjective.prototype.serialize = function() {
    return {
        type: this.type,
        target: this.target.toString(),
        count: this.count,
        location: this.count,
        id: this.id
    }
}

QuestObjective.deserialize = function(input) {
    return new QuestObjective(input.type, input.target, input.id, input.count, input.location);
}

exports.QuestObjective = QuestObjective;

/**
 * The status of an objective for a player.
 * 
 * @param {QuestObjective} obj 
 * @param {Number} count 
 */
function QuestObjectiveCompletionStatus(obj, count) {
    this.obj = obj;
    this.count = count;
    this._eventHandlers = {
        $progress: [],
        $cancelled: [],
        $completed: []
    };
    this._cancelToken = false;
    this._isWatching = false;
}

QuestObjectiveCompletionStatus.prototype.isComplete = function() {
    return this.count == this.obj.count;
}

QuestObjectiveCompletionStatus.prototype.on = function(event, handler) {
    if (!this._eventHandlers[property]) throw new Error(`Event ${event} does not exist`);
    this._eventHandlers[event].push(handler);
}

QuestObjectiveCompletionStatus.prototype._callHandlersFor = function(property, eventArgs) {
    var handlers = this._eventHandlers[property];
    for (let handler of handlers) {
        handler(this, eventArgs);
    }
}

QuestObjectiveCompletionStatus.prototype._finalize = function(e) {
    this._callHandlersFor('$completed', e);
    if (this._cancelToken) {
        this._cancelToken.unregister();
    }
}

QuestObjectiveCompletionStatus.prototype.beginWatch = function(player) {
    if (this._isWatching) return;
    if (this.isComplete()) {
        this._finalize();
        return;
    }
    this._isWatching = true;
    if (this.obj.type == QuestType.BREAK) {
        this._cancelToken = 
        eventHandler('block', 'break', (e) => {
            if (player.getUniqueId() == e.player.getUniqueId() && this.obj.target == e.getBlock().type) {
                this.count++;
                this.callHandlersFor('$progress', e);
            }
            if (this.count <= this.count) {
                this.finalize(e);
            }
        });
    }
    if (this.obj.type == QuestType.BREED) {
        this._cancelToken =
        eventHandler('entity', 'breed', (e) => {
            if (e.getBreeder().getUniqueId != undefined &&
                e.getBreeder().getUniqueId() == player.getUniqueId() &&
                e.getEntityType == this.obj.target) {
                    this.count++;
                    this.callHandlersFor('$progress', e);
                }
            if (this.count <= this.count) {
                this.finalize(e);
            }
        });
    }
    if (this.obj.type == QuestType.COLLECT) {
        this._cancelToken = 
        eventHandler('inventory', 'pickupItem', (e) => {
            if (e.getInventory().class == org.bukkit.inventory.PlayerInventory.class &&
                e.getInventory().getHolder != undefined &&
                e.getInventory().getHolder().getUniqueId() == player.getUniqueId() &&
                e.getItem().getItemStack().type == this.obj.target) {
                    this.count += e.getItem().getItemStack().getAmount();
                    this.callHandlersFor('$progress', e);
                }
            if (this.count <= this.count) {
                this.finalize(e);
            }
        });
    }
    if (this.obj.type == QuestType.CRAFT) {
        this._cancelToken =
        eventHandler('inventory', 'craft', (e) => {
            if (e.getInventory().class == org.bukkit.inventory.PlayerInventory.class &&
                e.getInventory().getHolder != undefined &&
                e.getInventory().getHolder().getUniqueId() == player.getUniqueId() &&
                e.getRecipe().getResult().type == this.obj.target) {
                    this.count += e.getRecipe().getResult().getAmount();
                    this.callHandlersFor('$progress', e);
                }
            if (this.count <= this.count) {
                this.finalize(e);
            }
        });
    }
    if (this.obj.type == QuestType.FISH) {
        this._cancelToken =
        eventHandler('player', 'fish', (e) => {
            if (e.getPlayer().getUniqueId() == player.getUniqueId()) {
                this.count++;
                this.callHandlersFor('$progress', e);
            }
            if (this.count <= this.count) {
                this.finalize(e);
            }
        });
    }
    if (this.obj.type == QuestType.KILL) {
        this._cancelToken = 
        eventHandler('entity', 'death', (e) => {
            if (e.getEntity().getKiller() != null &&
                e.getEntity().getKiller().getUniqueId != undefined && 
                e.getEntity().getKiller().getUniqueId() == player.getUniqueId() &&
                e.getEntity().getType() == this.obj.target) {
                    this.count++;
                    this.callHandlersFor('$progress', e);
                }
            if (this.count <= this.count) {
                this.finalize(e);
            }
        });
    }
    if (this.obj.type == QuestType.LOCATE) {
        this._cancelToken =
        eventHandler('player', 'move', (e) => {
            if (e.getTo().distanceSquared(this.obj.target) < 10) {
                this.finalize(e);
            }
        });
    }
    if (this.obj.type == QuestType.PLACE) {
        this._cancelToken =
        eventHandler('block', 'place', (e) => {
            if (e.getPlayer().getUniqueId() ==  player.getUniqueId() && 
                e.getBlock().type == this.obj.target.type) {
                    this.finalize(e);
                }
        });
    }
    if (this.obj.type == QuestType.SMELT) {
        this._cancelToken = 
        eventHandler('inventory', 'extract', (e) => {
            if (e.getPlayer().getUniqueId() == player.getUniqueId() && 
                e.getItemType() == this.obj.target) {
                    this.count += e.getItemAmount();
                    this.callHandlersFor('$progress', e);
                }
            if (this.count <= this.count) {
                this.finalize(e);
            }
        });
    }
}

QuestObjectiveCompletionStatus.prototype.toString = function() {
    return `${this.obj.type.toString().toLowerCase()} ${this.count} ${this.obj.target.toString().toLowerCase().replace('_', ' ')}`;
}

exports.QuestObjectiveCompletionStatus = QuestObjectiveCompletionStatus;