var quests = require('quests');
var factory = new quests.QuestFactory();
var testQuest = new quests.Quest('Test Quest')
    .break(org.bukkit.Material.STONE, 1)
    .kill(org.bukkit.entity.EntityType.COW, 1)
    .place(org.bukkit.Material.STONE, 1)
    .craft(org.bukkit.Material.STICK, 1)
    .fish(1)
    .breed(org.bukkit.entity.EntityType.COW, 1)
    .collect(org.bukkit.Material.STONE, 1)
    .smelt(org.bukkit.Material.STONE, 1)
    .locate(org.bukkit.entity.EntityType.SHEEP, 1);
// TODO: test all quest objectives. One was throwing a .toString() error.
testQuest.npcSpeechStart = [
    'Hello!',
    'Can you break some stone for me??'
];
testQuest.npcSpeechFinish = [
    'Thank you so much!'
];
factory.addQuest(testQuest);

registerEvent(player, 'join', function(e) {
    factory.loadQuester(e.getPlayer());
    if (!factory.isQuesting(e.getPlayer())) factory.addQuester(e.getPlayer(), testQuest.name);
});

registerEvent(player, 'quit', function(e) {
    factory.unloadQuester(e.getPlayer().getUniqueId());
});