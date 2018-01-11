import { QuestType } from './quest-actions';

export class QuestObjective {
    // Public properties
    public type: QuestType;
    public target;
    public count: number;
    public currentCount: number = 0;
    public location;
    public cancelToken;

    // Private properties
    private _eventHandlers: {};
    private _cancelReason: string;

    constructor(type: QuestType, target, count: number = 1, location = null) {
        this.type = type;
        this.target = target;
        this.count = count;
        this.location = location;
        this._eventHandlers = {
            "$progress": [],
            "$cancelled": [],
            "$completed": []
        };
    }

    setCurrentStatus(count: number) {
        this.currentCount = count;
    }

    /**
     * Registers an event handler to be executed.
     * @param event 
     * @param handler 
     */
    on(event: string, handler: (QuestObjective, any) => void) {
        if (!this._eventHandlers[event]) throw new Error('Event "' + event + '" does not exist.');
        this._eventHandlers[event].push(handler);
    }

    private callHandlersFor(property, eventArgs) {
        var handlers = this._eventHandlers[property];
        for (let i = 0; i < handlers.length; i++) {
            handlers[i](this, eventArgs);
        }
    }

    /**
     * Registers the events to watch.
     */
    beginWatch(player) {
        if (this.count <= this.currentCount) {
            this._eventHandlers['$completed'](this);
            return;
        }
        if (this.type == QuestType.BREAK) {
            this.cancelToken = 
            registerEvent(block, 'bbreak', (e) => {
                if (player.getUniqueId() == e.player.getUniqueId() && this.target == e.getBlock().type) {
                    this.currentCount++;
                    this.callHandlersFor('$progress', e);
                }
                if (this.count <= this.currentCount) {
                    this.callHandlersFor('$completed', e);
                    unregisterEvent(this.cancelToken);
                }
            });
        }
        if (this.type == QuestType.BREED) {
            this.cancelToken =
            registerEvent(entity, 'breed', (e) => {
                if (e.getBreeder().getUniqueId != undefined &&
                    e.getBreeder().getUniqueId() == player.getUniqueId() &&
                    e.getEntityType == this.target) {
                        this.currentCount++;
                        this.callHandlersFor('$progress', e);
                    }
                if (this.count <= this.currentCount) {
                    this.callHandlersFor('$completed', e);
                    unregisterEvent(this.cancelToken);
                }
            });
        }
        if (this.type == QuestType.COLLECT) {
            this.cancelToken = 
            registerEvent(inventory, 'pickupItem', (e) => {
                if (e.getInventory().class == org.bukkit.inventory.PlayerInventory.class &&
                    e.getInventory().getHolder != undefined &&
                    e.getInventory().getHolder().getUniqueId() == player.getUniqueId() &&
                    e.getItem().getItemStack().type == this.target) {
                        this.currentCount += e.getItem().getItemStack().getAmount();
                        this.callHandlersFor('$progress', e);
                    }
                if (this.count <= this.currentCount) {
                    this.callHandlersFor('$completed', e);
                    unregisterEvent(this.cancelToken);
                }
            });
        }
        if (this.type == QuestType.CRAFT) {
            this.cancelToken =
            registerEvent(inventory, 'craft', (e) => {
                if (e.getInventory().class == org.bukkit.inventory.PlayerInventory.class &&
                    e.getInventory().getHolder != undefined &&
                    e.getInventory().getHolder().getUniqueId() == player.getUniqueId() &&
                    e.getRecipe().getResult().type == this.target) {
                        this.currentCount += e.getRecipe().getResult().getAmount();
                        this.callHandlersFor('$progress', e);
                    }
                if (this.count <= this.currentCount) {
                    this.callHandlersFor('$completed', e);
                    unregisterEvent(this.cancelToken);
                }
            });
        }
        if (this.type == QuestType.FISH) {
            this.cancelToken =
            registerEvent(player, 'fish', (e) => {
                if (e.getPlayer().getUniqueId() == player.getUniqueId()) {
                    this.currentCount++;
                    this.callHandlersFor('$progress', e);
                }
                if (this.count <= this.currentCount) {
                    this.callHandlersFor('$completed', e);
                    unregisterEvent(this.cancelToken);
                }
            });
        }
        if (this.type == QuestType.KILL) {
            this.cancelToken = 
            registerEvent(entity, 'death', (e) => {
                if (e.getEntity().getKiller().class ==  org.bukkit.entity.PlayerEntity.class &&
                    e.getEntity().getKiller().getUniqueId() == player.getUniqueId() &&
                    e.getEntity().getType() == this.target) {
                        this.currentCount++;
                        this.callHandlersFor('$progress', e);
                    }
                if (this.count <= this.currentCount) {
                    this.callHandlersFor('$completed', e);
                    unregisterEvent(this.cancelToken);
                }
            });
        }
        if (this.type == QuestType.LOCATE) {
            this.cancelToken =
            registerEvent(player, 'move', (e) => {
                if (e.getTo().distanceSquared(this.target) < 10) {
                    this.callHandlersFor('$completed', e);
                    unregisterEvent(this.cancelToken);
                }
            });
        }
        if (this.type == QuestType.PLACE) {
            this.cancelToken =
            registerEvent(block, 'place', (e) => {
                if (e.getPlayer().getUniqueId() ==  player.getUniqueId() && 
                    e.getBlock().type == this.target.type) {
                        this.callHandlersFor('$completed', e);
                        unregisterEvent(this.cancelToken);
                    }
            });
        }
        if (this.type == QuestType.SMELT) {
            this.cancelToken = 
            registerEvent(inventory, 'extract', (e) => {
                if (e.getPlayer().getUniqueId() == player.getUniqueId() && 
                    e.getItemType() == this.target) {
                        this.currentCount += e.getItemAmount();
                        this.callHandlersFor('$progress', e);
                    }
                if (this.count <= this.currentCount) {
                    this.callHandlersFor('$completed', e);
                    unregisterEvent(this.cancelToken);
                }
            });
        }
    }

    /**
     * Unregisters the event handlers and cancel tokens.
     */
    destroy() {
        unregisterEVent(this.cancelToken);
    }
}