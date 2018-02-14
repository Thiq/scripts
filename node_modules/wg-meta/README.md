# World Guard Meta
>A module that allows a developer to store metadata about a world-guard region.

|requires|version|
|:---|---:|
|WorldGuard|6.0+|
|wg module|   |
|ender-chest module|   |

## How To Use
```
var wgm = require('wg-meta');
var wg = require('wg');

// get the region
var rm = wg.getRegionManager(world);
var region = rm.getRegion(regionId);

// get the table
var table = new wgm.WorldGuardMetadataTable(region.getId());
// get a value
var message = table.get('entry_message');
// set a value
table.set('entry_message', 'You have entered the region ' + region.getId());
```

## So How Does It Work?
It simply creates an object with the region ID as it's target and a dictionary-type object. When the class is constructed, it loads the meta from the 'wg-meta' table in `ender-chest`, and saves as values are set.