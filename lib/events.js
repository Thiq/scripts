// everything up until Bukkit only event emitters is copied from https://github.com/nodejs/node/blob/master/lib/events.js

var spliceOne;

function EventEmitter() {
    EventEmitter.init.call(this);
}

module.exports = EventEmitter;

EventEmitter.usingDomainds = false;
EventEmitter.prototype._events = undefined;
EventEmitter.prototype._eventsCount = 0;
EventEmitter.prototype._maxListeners = undefined;

var defaultMaxListeners = 10;

var errors;
function lazyErrors() {
    if (errors === undefined) errors = require('errors').codes;
    return errors;
}

Object.defineProperty(EventEmitter, 'defaultMaxListeners', {
    enumerable: true,
    get: function() {
        return defaultMaxListeners;
    },
    set: function(arg) {
        if (typeof arg !== 'number' || arg < 0 || Number.isNaN(arg)) {
            var errors = lazyErrors();
            throw new errors.ERR_OUT_OF_RANGE('defaultMaxListeners', 'a non-negative number', arg);
        }
        defaultMaxListeners = arg;
    }
});

EventEmitter.init = function() {
    if (this._events === undefined || this._events === Object.getPrototypeOf(this)._events) {
        this._events = Object.create(null);
        this._eventsCount = 0;
    }
    this._maxListeners = this._maxListeners || undefined;
}

EventEmitter.prototype.setMaxListeners = function setMaxListeners(n) {
    if (typeof n !== 'number' || n < 0 || Number.isNaN(n)) {
        var errors = lazyErrors();
        throw new errors.ERR_OUT_OF_RANGE('n', 'a non-negative number', n);
    }
    this._maxListeners = n;
    return this;
}

function $getMaxListeners(that) {
    if (this._maxListeners === undefined) {
        return EventEmitter.defaultMaxListeners;
    }
    return that._maxListeners;
}

EventEmitter.prototype.getMaxListeners = function getMaxListeners() {
    return $getMaxListeners(this);
}

EventEmitter.prototype.emit = function emit(type) {
    var args = Array.prototype.slice.call(null, arguments).slice(1);
    var doError = (type === 'error');
    var events = this._events;
    if (events !== undefined) {
        doError = (doError && events.error === undefined);
    } else if (!doError) {
        return false;
    }
    if (doError) {
        var er;
        if (args.length > 0) er = args[0];
        if (er instanceof Error) {
            throw er;
        }

        var errors = lazyErrors();
        var err = new errors.ERR_UNHANDLED_ERROR(er);
        err.context = er;
        throw err;
    }

    var handler = events[type];

    if (!handler) return false;
    if (typeof handler === 'function') {
        Reflect.apply(handler, this, args);
    }

    return true;
}

function _addListener(target, type, listener, prepend) {
    var m, events, existing;
    if (typeof listener !== 'function') {
        var errors = lazyErrors();
        throw new errors.ERR_INVALID_ARG_TYPE('listener', 'Function', listener);
    }

    events = target._events;
    if (events === undefined) {
        events = target._events = Object.create(null);
        target._eventsCount = 0;
    } else {
        if (events.newListener !== undefined) {
            target.emit('newListener', type, listener.listener ? listener.listener : listener);
            events = target._events;
        }
        existing = events[type];
    }

    if (existing === undefined) {
        existing = events[type] = listener;
        ++target._eventsCount;
    } else {
        if (typeof existing === 'function') {
            existing = events[type] = prepend ? [listener, existing] : [existing, listener];
        } else if (prepend) {
            existing.unshift(listener);
        } else {
            existing.push(listener);
        }

        m = $getMaxListeners(target);
        if (m > 0 && existing.length > m && !existing.warned) {
            existing.warned = true;
            var w = new Error('Possible EventEmitter memory leak detected. ' + 
                            existing.length + ' ' + String(type) + ' listeners ' + 
                        'added. Use emitter.setMaxListeners() to increase limit');
            w.name = 'MaxListenersExceededWarning';
            w.emitter = target;
            w.type = type;
            w.count = existing.length;
            //process.emitWarning(w);
        }
    }
    return target;
}

EventEmitter.prototype.addListener = function addListener(type, listener) {
    return _addListener(this, type, listener, false);
}

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.prependListener = function prependListener(type, listener) {
    return _addListener(this,type, listener, true);
}

function onceWrapper() {
    var args = Array.prototype.slice.call(this, arguments);
    if (!this.fired) {
        this.target.removeListener(this.type, this.wrapFn);
        this.fired = true;
        Reflect.apply(this.listener, this.target, args);
    }
}

function _onceWrap(target, type, listener) {
    var state = {
        fired: false,
        wrapFn: undefined,
        target,
        type,
        listener
    };
    var wrapped = onceWrapper.bind(state);
    wrapped.listener = listener;
    state.wrapFn = wrapped;
    return wrapped;
}

EventEmitter.prototype.once = function(type, listener) {
    if (typeof listener !== 'function') {
        var errors = lazyErrors();
        throw new errors.ERR_INVALID_ARG_TYPE('listener', 'Function', listener);
    }
    this.on(type, _onceWrap(this, type, listener));
    return this;
}

EventEmitter.prototype.prependOnceListener = function prependOnceListener(type, listener) {
    if (typeof listener !== 'function') {
        var errors = lazyErrors();
        throw new errors.ERR_INVALID_ARG_TYPE('listener', 'Function', listener);
    }
    this.prependListener(type, _onceWrap(this, type, listener));
    return this;
}

EventEmitter.prototype.removeListener = function(type, listener) {
    var list, events, position, i, originalListener;
    if (typeof listener !== 'function') {
        var errors = lazyErrors();
        throw new errors.ERR_INVALID_ARG_TYPE('listener', 'Function', listener);
    }

    events = this._events;
    if (events === undefined) return this;
    list = events[type];
    if (list === undefined) return this;

    if (list === listener || list.listener === listener) {
        if (--this._eventsCount === 0) this._events = Object.create(null);
        else {
            delete events[type];
            if (events.removeListener) this.emit('removeListener', type, list.listener || listener);
        }
    } else if (typeof list !== 'function') {
        position = -1;
        for (i = list.length - 1; i >= 0; i--) {
            if (list[i] === listener || list[i].listener === listener) {
                originalListener = list[i].listener;
                position = i;
                break;
            }
        }

        if (position < 0) return this;

        if (position === 0) list.shift();
        else {
            if (spliceOne === undefined) spliceone = require('internal/utils').spliceOne;
            spliceOne(list, position);
        }

        if (list.length === 1) events[type] = list[0];
        if (events.removeListener !== undefined) {
            this.emit('removeListener', type, originalListener || listener);
        }
        return this;
    }
}

EventEmitter.prototype.off = EventEmitter.prototype.removeListener;

EventEmitter.prototype.removeAllListeners = function(type) {
    var listeners, events, i;
    events = this._events;
    if (events === undefined) return this;
    if (events.removeListener === undefined) {
        if (arguments.length === 0) {
            this._events = Object.create(null);
            this._eventsCount = 0;
        } else if (events[type] === undefined) {
            if (--this._eventsCount === 0) this._events = Object.create(null);
            else delete events[type];
        }
        return this;
    }

    if (arguments.length === 0) {
        var keys = Object.keys(events);
        var key;
        for (i = 0; i < keys.length; ++i) {
            key = keys[i];
            if (key === 'removeListener') continue;
            this.removeAllListeners(key);
        }
        this.removeAllListeners('removeListener');
        this._events = Object.create(null);
        this._eventsCount = 0;
        return this;
    }

    listeners = events[type];

    if (typeof listeners === 'function') {
        this.removeListener(type, listeners);
    } else if (listeners !== undefined) {
        for (i = listeners.length - 1; i >= 0; i--) {
            this.removeListener(type, listeners[i]);
        }
    }

    return this;
}

function _listeners(target, type, unwrap) {
    var events = target._events;

    if (events === undefined) return [];
    var evlistener = events[type];
    if (evlistener === undefined) return [];

    if (typeof evlistener === 'function') {
        return unwrap ? [evlistener.listener || evlistener] : [evlistener];
    }

    return unwrap ? unwrapListeners(evlistener) : arrayClone(evlistener, evlistener.length);
}

EventEmitter.prototype.listeners = function(type) {
    return _listeners(this, type, true);
}

EventEmitter.prototype.rawListeners = function(type) {
    return _listeners(this, type, false);
}

EventEmitter.listenerCount = function(emitter, type) {
    if (typeof emitter.listenerCount === 'function') {
        return emitter.listenerCount(type);
    } else {
        return listenerCount.call(emitter, type);
    }
}

EventEmitter.prototype.listenerCount = listenerCount;
function listenerCount(type) {
    var events = this._events;
    if (events !== undefined) {
        var evlistener = events[type];
        if (typeof evlistener === 'function') {
            return 1;
        } else if (evlistener !== undefined) {
            return evlistener.length;
        }
    }

    return 0;
}

EventEmitter.prototype.eventNames = function() {
    return this._eventsCount > 0 ? Reflect.ownKeys(this._events) : [];
}

function arrayClone(arr, n) {
    var copy = new Array(n);
    for (var i = 0; i < n; ++i) {
        copy[i] = arr[i];
    }
    return copy;
}

function unwrapListeners(arr) {
    var ret = new Array(arr.length);
    for (var i = 0; i < ret.length; ++i) {
        ret[i] = arr[i].listener || arr[i];
    }
    return ret;
}

//============
//Spigot EventHandler implementation
//============
// TODO: make this like node.
/*

Goal usage:
var blockEmitter = EventEmitter.spigot.block;
blockEmitter.on('break', function(e) {
    console.log('A block was broken!');
});

*/
var registeredListeners = EventEmitter.spigot = {};

function CancelToken(listener, eventName) {
    this.$baseToken = new java.lang.Object();
    this.listener = listener;
    this.eventName = eventName;
}

CancelToken.prototype.equals = function(compare) {
    return compare.$baseToken == this.$baseToken;
}

CancelToken.prototype.unregister = function() {
    var callbacks = this.listener.callbacks[this.eventName];
    for (var i = 0; i < callbacks.length; ++i) {
        var callback = callbacks[i];
        if (this.equals(callback.cancelToken)) {
            callbacks.splice(i, 1);
            return;
        }
    }
}

function SpigotEmitter(name) {
    this.registeredEventClasses = {};
    this.callbacks = {};
    this.$baseListener = ThiqListener.newInstance(); // I don't like having to hack this, but oh well
    registeredListeners[name] = this;
}

SpigotEmitter.prototype.registerEvent = function(name, eventClass) {
    var self = this;
    this.registeredEventClasses[name] = eventClass;
    this.$baseListener.registerEvent(eventClass, function(event) {
        self.invoke(name, event);
    });
    return self;
}

SpigotEmitter.prototype.registerHandler = function(event, callback) {
    if (event === undefined) {
        if (errors === undefined) lazyErrors();
        throw new errors.ERR_INVALID_ARG_VALUE('event', event, 'event name cannot be empty');
    }
    if (!this.callbacks[event]) {
        this.callbacks[event] = [];
    }
    var cancelToken = new CancelToken(this, event);
    callback.cancelToken = cancelToken;
    this.callbacks[event].push(callback);
    return callback.cancelToken;
}

SpigotEmitter.prototype.on = SpigotEmitter.prototype.registerHandler;

SpigotEmitter.prototype.registerHandlerOnce = function(event, callback) {
    
}

SpigotEmitter.prototype.once = SpigotEmitter.prototype.registerHandlerOnce;

SpigotEmitter.prototype.invoke = function(event, args) {
    if (event === undefined) {
        if (errors === undefined) lazyErrors();
        throw new errors.ERR_INVALID_ARG_VALUE('event', event, 'event name cannot be empty');
    }
    var callbacks = this.callbacks[event];
    if (!callbacks) return;
    for (var i = 0; i < callbacks.length; ++i) {
        callbacks[i](args);
    }
}

SpigotEmitter.prototype.emit = SpigotEmitter.prototype.invoke;

function registerNewListener(name, eventMatches) {
    if (name === undefined || name.length === 0 || typeof name !== 'string') {
        if (errors === undefined) lazyErrors();
        throw new errors.ERR_INVALID_ARG_VALUE('name', name, 'listener name cannot be empty');
    }
    var listener = new SpigotEmitter(name);
    if (eventMatches != undefined) {
        for (var property in eventMatches) {
            if (!eventMatches.hasOwnProperty(property)) continue;
            var value = eventMatches[property];
            listener.registerEvent(property, value);
        }
    }
    return listener;
}

function eventHandler(listenerName, eventName, callback) {
    if (!registeredListeners[listenerName]) return;
    var listener = registeredListeners[listenerName];
    return listener.registerHandler(eventName, callback);
}

EventEmitter.SpigotEmitter = SpigotEmitter;
global.eventHandler = eventHandler;
global.registerNewListener = registerNewListener;

// BlockListener
var blockEvent = org.bukkit.event.block;
var BlockListener = registerNewListener('block', {
    break: blockEvent.BlockBreakEvent.class,
    place: blockEvent.BlockPlaceEvent.class,
    canBuild: blockEvent.BlockCanBuildEvent.class,
    damage: blockEvent.BlockDamageEvent.class,
    dispense: blockEvent.BlockDispenseEvent.class,
    exp: blockEvent.BlockExpEvent.class,
    explode: blockEvent.BlockExplodeEvent.class,
    fade: blockEvent.BlockFadeEvent.class,
    form: blockEvent.BlockFormEvent.class,
    fromTo: blockEvent.BlockFromToEvent.class,
    grow: blockEvent.BlockGrowEvent.class,
    ignite: blockEvent.BlockIgniteEvent.class,
    multiPlace: blockEvent.BlockMultiPlaceEvent.class,
    physics: blockEvent.BlockPhysicsEvent.class,
    pistonExtend: blockEvent.BlockPistonExtendEvent.class,
    pistonRetract: blockEvent.BlockPistonRetractEvent.class,
    redstone: blockEvent.BlockRedstoneEvent.class,
    spread: blockEvent.BlockSpreadEvent.class,
    cauldronLevelChange: blockEvent.CauldronLevelChangeEvent.class,
    entityForm: blockEvent.EntityBlockFormEvent.class,
    leavesDecay: blockEvent.LeavesDecayEvent.class,
    notePlay: blockEvent.NotePlayEvent.class,
    signChange: blockEvent.SignChangeEvent.class
});

// EnchantListener
var enchantEvent = org.bukkit.event.enchantment;
var EnchantListener = registerNewListener('enchantment', {
    enchant: enchantEvent.EnchantItemEvent.class,
    prepare: enchantEvent.PrepareItemEnchantEvent.class
});

// EntityListener
var entityEvent = org.bukkit.event.entity;
var EntityListener = registerNewListener('entity', {
    areaEffectCloudApply: entityEvent.AreaEffectCloudApplyEvent.class,
    enderDragonChangePhase: entityEvent.EnderDragonChangePhaseEvent.class,
    airChange: entityEvent.EntityAirChangeEvent.class,
    breed: entityEvent.EntityBreedEvent.class,
    creatureSpawn: entityEvent.CreatureSpawnEvent.class,
    creeperPower: entityEvent.CreeperPowerEvent.class,
    breakDoor: entityEvent.EntityBreakDoorEvent.class,
    changeBlock: entityEvent.EntityChangeBlockEvent.class,
    combust: entityEvent.EntityCombustEvent.class,
    combustByBlock: entityEvent.EntityCombustByBlockEvent.class,
    createPortal: entityEvent.EntityCreatePortalEvent.class,
    damage: entityEvent.EntityDamageEvent.class,
    damageByBlock: entityEvent.EntityDamageByBlockEvent.class,
    death: entityEvent.EntityDeathEvent.class,
    explode: entityEvent.EntityExplodeEvent.class,
    interact: entityEvent.EntityInteractEvent.class,
    portalEnter: entityEvent.EntityPortalEnterEvent.class,
    portalExit: entityEvent.EntityPortalExitEvent.class,
    regainHealth: entityEvent.EntityRegainHealthEvent.class,
    resurrect: entityEvent.EntityResurrectEvent.class,
    shootBow: entityEvent.EntityShootBowEvent.class,
    tame: entityEvent.EntityTameEvent.class,
    target: entityEvent.EntityTargetEvent.class,
    targetLivingEntity: entityEvent.EntityTargetLivingEntityEvent.class,
    teleport: entityEvent.EntityTeleportEvent.class,
    expBottle: entityEvent.ExpBottleEvent.class,
    explosionPrime: entityEvent.ExplosionPrimeEvent.class,
    fireworkExplode: entityEvent.FireworkExplodeEvent.class,
    foodLevelChange: entityEvent.FoodLevelChangeEvent.class,
    itemDespawn: entityEvent.ItemDespawnEvent.class,
    pigZap: entityEvent.PigZapEvent.class,
    lingeringPotionSplash: entityEvent.LingeringPotionSplashEvent.class,
    playerDeath: entityEvent.PlayerDeathEvent.class,
    playerLeashEntity: entityEvent.PlayerLeashEntityEvent.class,
    potionSplash: entityEvent.PotionSplashEvent.class,
    projectileHit: entityEvent.ProjectileHitEvent.class,
    projectileLaunch: entityEvent.ProjectileLaunchEvent.class,
    sheepDyeWool: entityEvent.SheepDyeWoolEvent.class,
    sheepRegrowWool: entityEvent.SheepRegrowWoolEvent.class,
    slimeSplit: entityEvent.SlimeSplitEvent.class,
    spawnerSpawn: entityEvent.SpawnerSpawnEvent.class,
    villagerAcquireTrade: entityEvent.VillagerAcquireTradeEvent.class,
    villagerReplenishTrade: entityEvent.VillagerReplenishTradeEvent.class
});

// HangingListener
var hangingEvent = org.bukkit.event.hanging;
var HangingListener = registerNewListener('hanging', {
    breakByEntity: hangingEvent.HangingBreakByEntityEvent.class,
    break: hangingEvent.HangingBreakEvent.class,
    place: hangingEvent.HangingPlaceEvent.class
});

// InventoryListener
var invEvent = org.bukkit.event.inventory;
var InventoryListener = registerNewListener('inventory', {
    brew: invEvent.BrewEvent.class,
    brewingStandFuel: invEvent.BrewingStandFuelEvent.class,
    craft: invEvent.CraftItemEvent.class,
    burn: invEvent.FurnaceBurnEvent.class,
    furnaceExtract: invEvent.FurnaceExtractEvent.class,
    smelt: invEvent.FurnaceSmeltEvent.class,
    click: invEvent.InventoryClickEvent.class,
    close: invEvent.InventoryCloseEvent.class,
    creative: invEvent.InventoryCreativeEvent.class,
    drag: invEvent.InventoryDragEvent.class,
    interact: invEvent.InventoryInteractEvent.class,
    moveItem: invEvent.InventoryMoveItemEvent.class,
    pickupItem: invEvent.InventoryMoveItemEvent.class,
    open: invEvent.InventoryOpenEvent.class,
    prepareAnvil: invEvent.PrepareAnvilEvent.class,
    prepareItemCraft: invEvent.PrepareItemCraftEvent.class
});

// PlayerListener
var playerEvent = org.bukkit.event.player;
var PlayerListener = registerNewListener('player', {
    asyncChat: playerEvent.AsyncPlayerChatEvent.class,
    asyncPreLogin: playerEvent.AsyncPlayerPreLoginEvent.class,
    animation: playerEvent.PlayerAnimationEvent.class,
    armorStandManipulate: playerEvent.PlayerArmorStandManipulateEvent.class,
    bedEnter: playerEvent.PlayerBedEnterEvent.class,
    bedLeave: playerEvent.PlayerBedLeaveEvent.class,
    bucketEmpty: playerEvent.PlayerBucketEmptyEvent.class,
    bucketFill: playerEvent.PlayerBucketFillEvent.class,
    changedMainHand: playerEvent.PlayerChangedMainHandEvent.class,
    changedWorld: playerEvent.PlayerChangedWorldEvent.class,
    chat: playerEvent.AsyncPlayerChatEvent.class,
    chatTabComplete: playerEvent.PlayerChatTabCompleteEvent.class,
    command: playerEvent.PlayerCommandPreprocessEvent.class,
    dropItem: playerEvent.PlayerDropItemEvent.class,
    editBook: playerEvent.PlayerEditBookEvent.class,
    eggThrow: playerEvent.PlayerEggThrowEvent.class,
    expChange: playerEvent.PlayerExpChangeEvent.class,
    fish: playerEvent.PlayerFishEvent.class,
    gameMode: playerEvent.PlayerGameModeChangeEvent.class,
    interactAt: playerEvent.PlayerInteractAtEntityEvent.class,
    interact: playerEvent.PlayerInteractEvent.class,
    interactEntity: playerEvent.PlayerInteractEntityEvent.class,
    itemBreak: playerEvent.PlayerItemBreakEvent.class,
    itemHeld: playerEvent.PlayerItemHeldEvent.class,
    join: playerEvent.PlayerJoinEvent.class,
    kick: playerEvent.PlayerKickEvent.class,
    levelChange: playerEvent.PlayerLevelChangeEvent.class,
    login: playerEvent.PlayerLoginEvent.class,
    move: playerEvent.PlayerMoveEvent.class,
    pickupArrow: playerEvent.PlayerPickupArrowEvent.class,
    portal: playerEvent.PlayerPortalEvent.class,
    preLogin: playerEvent.AsyncPlayerPreLoginEvent.class,
    quit: playerEvent.PlayerQuitEvent.class,
    registerChannel: playerEvent.PlayerRegisterChannelEvent.class,
    respawn: playerEvent.PlayerRespawnEvent.class,
    shear: playerEvent.PlayerShearEntityEvent.class,
    statisticIncrement: playerEvent.PlayerStatisticIncrementEvent.class,
    resourcePackStatus: playerEvent.PlayerResourcePackStatusEvent.class,
    swapHandItems: playerEvent.PlayerSwapHandItemsEvent.class,
    teleport: playerEvent.PlayerTeleportEvent.class,
    flight: playerEvent.PlayerToggleFlightEvent.class,
    sneak: playerEvent.PlayerToggleSneakEvent.class,
    sprint: playerEvent.PlayerToggleSprintEvent.class,
    unleash: playerEvent.PlayerUnleashEntityEvent.class,
    unregisterChannel: playerEvent.PlayerUnregisterChannelEvent.class,
    velocity: playerEvent.PlayerVelocityEvent.class
});

// ServerListener
var serverEvent = org.bukkit.event.server;
var ServerListener = registerNewListener('server', {
    mapInit: serverEvent.MapInitializeEvent.class,
    pluginDisable: serverEvent.PluginDisableEvent.class,
    pluginEnable: serverEvent.PluginEnableEvent.class,
    remoteCommand: serverEvent.RemoteServerCommandEvent.class,
    command: serverEvent.ServerCommandEvent.class,
    serverListPing: serverEvent.ServerListPingEvent.class,
    serviceRegister: serverEvent.ServiceRegisterEvent.class,
    serviceUnregister: serverEvent.ServiceUnregisterEvent.class,
    tabComplete: serverEvent.TabCompleteEvent.class
});

// VehicleListener
var vehEvent = org.bukkit.event.vehicle;
var VehicleListener = registerNewListener('vehicle', {
    blockCollision: vehEvent.VehicleBlockCollisionEvent.class,
    create: vehEvent.VehicleCreateEvent.class,
    damage: vehEvent.VehicleDamageEvent.class,
    destroy: vehEvent.VehicleDestroyEvent.class,
    enter: vehEvent.VehicleEnterEvent.class,
    entityCollision: vehEvent.VehicleEntityCollisionEvent.class,
    exit: vehEvent.VehicleExitEvent.class,
    move: vehEvent.VehicleMoveEvent.class,
    update: vehEvent.VehicleUpdateEvent.class
});

// WeatherListener
var weatherEvent = org.bukkit.event.weather;
var WeatherListener = registerNewListener('weather', {
    lightning: weatherEvent.LightningStrikeEvent.class,
    thunderChange: weatherEvent.ThunderChangeEvent.class,
    weatherChange: weatherEvent.WeatherChangeEvent.class
});

// WorldListener
var worldEvent = org.bukkit.event.world;
var WorldListener = registerNewListener('world', {
    chunkLoad: worldEvent.ChunkLoadEvent.class,
    chunkPopulate: worldEvent.ChunkPopulateEvent.class,
    chunkUnload: worldEvent.ChunkUnloadEvent.class,
    portalCreate: worldEvent.PortalCreateEvent.class,
    spawnChange: worldEvent.SpawnChangeEvent.class,
    structureGrow: worldEvent.StructureGrowEvent.class,
    init: worldEvent.WorldInitEvent.class,
    load: worldEvent.WorldLoadEvent.class,
    save: worldEvent.WorldSaveEvent.class,
    unload: worldEvent.WorldUnloadEvent.class
});

