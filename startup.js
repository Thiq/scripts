// load all the profiles
var pf = require('pf');
pf.initialize();
require('entity-updater').start();

var quests = require('quests2');
var factory = new quests.QuestFactory();
