// load all the profiles
var pf = require('pf');
pf.initialize();

var quests = require('quests2');
var factory = new quests.QuestFactory();

require('./src/code-import');
require('./src/golden-axe');
require('./src/mention');
