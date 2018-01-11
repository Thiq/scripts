# Quests
>A fucking shitstorm. That's all.
## How To Use
```
var quests = require('quests');
```
### Creating A New Quest
Creating a quest is simple; even the unexperienced programmer can do it. All quest requirements simply involve the `Quest` class to create objectives, rewards, and NPC text.
```
var quest = new.quests.Quest('My Quest Name');
// you can either put in each objective individually...
quest.break(Material.STONE, 10);
// or you can chain them together
quest
    .collect(Material.COBBLESTONE, 10)
    .smelt(Material.STONE, 10);
// possible quest objectives are:
//  - break(material, count)
//  - place(material, count, location (not necessary))
//  - craft(material, count)
//  - fish(count)
//  - kill(entity, count)
//  - breed(entity, count)
//  - collect(material, count)
//  - smelt(material, count)
//  - locate(entity, count, location (not necessary))
// to set the reward, simply use .setReward
quest.setReward(itemStack(Material.DIAMOND, 5));
// to set what the NPC says before you embark on the quest, use .npcSpeechStart
quest.npcSpeechStart = [
    'Hello traveler!',
    'I need some smelted stone, mind helping me out?'
    'I can give diamonds as a reward!'
];
// to set what the NPC says after you completed it, use .npcSpeechFinish
quest.npcSpeechFinish = [
    'Thanks again, man!'
];
```
