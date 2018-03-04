// load all the profiles
var pf = require('pf');
pf.initialize();
require('entity-updater').start();

var quests = require('quests');
var QuestFactory = quests.QuestFactory;
var NPCFactory = quests.NPCFactory;
var Quest = quests.Quest;
