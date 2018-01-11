var quests = require('quests');
var factory = new quests.QuestFactory();
var testQuest = new quests.Quest('Test Quest').break(org.bukkit.Material.STONE, 4);
factory.addQuest(testQuest);

registerEvent(player, 'join', function(e) {
    factory.addQuester(e.getPlayer(), testQuest.id);
});