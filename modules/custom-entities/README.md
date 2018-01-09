# Custom Entities
>A module for creating, spawning, and saving custom entities like mobs, NPCs, or animals.  

|requires|version|
|:---|---:|
|ender-chest module| * |

## How To Use
### Monsters
```
var customEntities = require('custom-entities');

var myBoss = new customEntities.Monster({
    name: "My Boss", // the entity's name
    id: "my_boss", // the filename of the model and texture
    type: customEntities.Monster.Type.CQB, // CQB or Ranged
    showHealthBar: true, // show a boss bar for health
    animate: true, // show animations
    minHealth: 0, // default is 0
    maxHealth: 100, // default is 20
    onSpawn: function(entity, e) {
        // add weapons, armor, etc. Before this is called, the entity is invisble.
        // once the function is complete, the entity is visible.
    },
    onDeath: function(entity, e) {

    },
    drops: [
        { chance: 0.5, value: org.bukkit.Material.STONE },
        { chance: 0.45, value: org.bukkit.Material.SAND },
        { chance: 0.05, value: org.bukkit.Material.DIAMOND_BLOCK }
    ],
    biomes: [], // biomes naturally found in. If empty, it cannot spawn naturally.
    isSilent: false
});
// spawn it
myBoss.spawnAt(x, y, z, world);
```

### Furniture
```
var chair = new customEntities.Furniture({
    displayName: "Chair",
    name: "chair",
    isGlowing: false,

});