// All script initialization begins here. All globals are set in here.
global = this;
var Bukkit = org.bukkit.Bukkit;

function loadCore(name) {
    try {

        log('Loading core library file ' + name, 'd');
    } catch (ex) {

    }
    loader.load('./plugins/Thiq/core/' + name + '.js');
}

// load core scripts
//    first load the logger
loadCore('logger');
//    then thiq types
loadCore('types');
//    then loader 
loadCore('loader');
//    then require
loadCore('require');
// load the rest of the core
loadCore('lang');
loadCore('safety');
loadCore('promise');
loadCore('config');
loadCore('events');
loadCore('commands');
loadCore('permissions');
loadCore('thiq');