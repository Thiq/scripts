# World Guard
>A module wrapper around sk89q's World Guard.  

|requires|version|
|---|---|
|WorldGuard|6.0+|

## How To Use
```
var wg = require('wg');
// determine a region
var region = wg(world).getRegionAt(x, y, z);
// get region by ID
region = wg(world).getRegion(id);
// region objects returned are of com.sk89q.worldguard.protection.regions.ProtectedRegion

// get the base WG plugin
var worldguard = wg.base;
```