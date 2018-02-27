var p = require('placeholder');

global.minecraft_item_regexes = [
    [/^air$/i, 0],
    [/^stone$/i, 1],
    [/^grass$/i, 2],
    [/^dirt$/i, 3],
    [/^cobble(stone)?$/i, 4],
    [/plank(s)?$/i, 5],
    [/^sap/i, 6],
    [/^bedrock$/i, 7],
    [/^(still)?(.*)water$/i, 8],
    [/^(sta)?(.*)water$/i, 9],
    [/^lava$/i, 10],
    [/^(sta)?(.*)lava$/i, 11],
    [/^sand$/i, 12],
    [/^gravel$/i, 13],
    [/^gold(_)?ore$/i, 14],
    [/^iron(_)?ore$/i, 15],
    [/^coal(_)?ore$/i, 16],
    [/^(wood|log)$/i, 17],
    [/^lea(f|ve)(s)?$/i, 18],
    [/^sponge$/i, 19],
    [/^glass$/i, 20],
    [/^lapis(.*)ore$/i, 21],
    [/^lapis/i, 22],
    [/^dispenser$/i, 23],
    [/^sandstone$/i, 24],
    [/^note/i, 25],
    // [/^bed(.*)block$/i, 26]
    [/^power(.*)(rail|track)$/i, 27],
    [/^detect(.*)(rail|track)$/i, 28],
    [/^stick(.*)piston$/i, 29],
    [/web$/i, 30],
    [/^(tallgrass|shrub|fern)$/i, 31],
    [/^deadshrub$/i, 32],
    [/^piston$/i, 33],
    // [/^piston(.*)head$/i, 34]
    [/^wool$/i, 34],

    [/^redstone(_)?lamp$/i, 123],

    [/^ink/i, 351],
];

global.enumFind = function(_enum, value) {
    value = _s(value).toUpperCase().replace(/[_]/i, '');
    for (var field in _enum) {
        var name = _s(field).toUpperCase().replace(/[_]/i, '');
        if (name == value) return _enum[field];
    }
    return undefined;
}

global.getItemId = function(value) {
    if (value instanceof org.bukkit.Material) {
        return value.id;
    }
    if (!isNaN(value)) {
        return value;
    }
    var enval = enumFind(org.bukkit.Material, value);
    if (enval != undefined) {
        return enval.id;
    }
}

global.itemStack = function(options) {
    if (!options) return new org.bukkit.inventory.ItemStack(Material.AIR);
    if (!options.type) throw new Error('No block type passed to itemstack creation.');
    options.type = getItemId(options.type);
    if (!options.count) options.count = 1;
    if (!options.lore) options.lore = [];
    if (!options.enchants) options.enchants = [];
    if (options.isUnbreakable == undefined) options.isUnbreakable = false;
    if (!options.flags) options.flags = [];
    var item = new org.bukkit.inventory.ItemStack(options.type);
    item.amount = options.count;
    if (options.data != undefined) {
        item.durability = options.data;
    }
    var meta = item.getItemMeta();
    if (options.displayName != undefined) {
        meta.setDisplayName(options.displayName);
    }
    if (options.localizedName != undefined) {
        meta.setLocalizedName(options.localizedName);
    }
    meta.setUnbreakable(options.isUnbreakable);
    meta.setLore(options.lore);
    for (var i = 0; i < options.flags.length; i++) {
        var flag = options.flags[i];
        meta.addItemFlags(flag);
    }
    for (var i = 0; i < options.enchants.length; i++) {
        var enchant = options.enchants[i];
        meta.addEnchant(enchant.enchantment, enchant.level || 1, enchant.ignoreLevelRestriction === true);
    }
    item.setItemMeta(meta);
    return item;
}

function BlockInfo(block) {
    this.id = block.typeId || block.id;
    this.data = block.durability || block.data;
    this.isSolid = block.type.solid || block.isSolid;
}

BlockInfo.prototype.getBlock = function() {
    return this.id;
}

global.BlockInfo = BlockInfo;

global.defaultPermissionMessage = '\xA7cYou don\'t have permission to use that!';

global.isPlayer = function(sender) {
    return sender.getDisplayName != undefined;
}

global.getNms = function(c) {
    var version = Bukkit.getServer().getClass().getPackage().getName().split('.')[3];
    var namespace = "net.minecraft.server.";
    if (!c) return namespace + version;
    else return Java.type(namespace + version + '.' + c);
}

eventHandler('server', 'pluginEnable', function(e) {
    var plugin = e.getPlugin();
    // TODO: should I get all classes from within a plugin and load their package into the global object?
    if (plugin == getPlugin()) return;
    global[plugin.getClass().getName()] = plugin;
    createGlobalObjectFromClass(plugin.getClass());
    var listeners = org.bukkit.event.HandlerList.getRegisteredListeners(plugin);
    // this is some jewery
    listeners.forEach(function(l) {
        var lClass = l.getClass();
        var lMethods = lClass.getMethods();
        for (var j = 0; j < lMethods.length; j++) {
            var method = lMethods[j];
            var mAnnotations = method.getDeclaredAnnotations();
            var mParams = method.getParameterTypes();
            for (var i = 0; i < mParams.length; i++) {
                if (mParams.length != 1) continue;
                var type = mParams[i];
                var isEvent = type.isAssignableFrom(org.bukkit.event.Event.class);
                if (!isEvent) continue;
                createGlobalObjectFromClass(lClass);
                createGlobalObjectFromClass(type);
            }
        }
    })
});

// we need to find a way to iterate through all of a package name (ie: net.conji.thiq.Thiq) and create
// a global object of the final type
function createGlobalObjectFromClass(type) {
    
}