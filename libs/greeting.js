var quests = require('quests');
var Quest = quests.types().Quest;

registerEvent(player, 'join', function(e) {
	quests.factory().QuestFactory.assignQuest(e.getPlayer(), new Quest("The Magus's Garden").collect(3, org.bukkit.Material.SUGAR_CANE));
});