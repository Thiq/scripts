# Configuring Thiq
If you're using Thiq only as a server owner and not in a development capacity, you can skip this section (unless you want to learn about how to customize Thiq).

## `thiq.json`
We lightly touched on the config JSON when setting up so we could add libraries to load, but it feels wrong to not give the config any more love than that. The 
capabilities of this file is constantly being added to, but here we can go over everything that is either implemented or being implemented (they'll be trailed with a *).

### `thiq.json:libraries`
We briefly went over this, and we'll add to it here again just for clearer descriptions. The files listed in here are files in relative path to the `libs` folder. While 
it's recommended you only put files from there into this array, it's not against the rules to point to outside sources. Upcoming functionality will include the ability 
to add URLs to this list so they can be dynamically loaded from an external source. You'll just have to prepend the file with the appropriate `http(s)` as usual. 

### `thiq.json:modulesDir`
When you first clone the repository, there's a `node_modules` (or `modules`) folder there to house all the modules Thiq can use. This folder name should match the value 
of `modulesDir` relative to the main server folder. This will allow for you to have multiple servers that share the same modules folder (this could be used in globally 
installing the modules). If `modulesDir` doesn't have a value, it'll default to `./plugins/Thiq/modules/`.

__REMEMBER:__ You MUST end the value with `/` to denote it as a directory.

__Note:__ globally installed modules is not supported yet, but when they are, you'll be able to use the value `$PATH` to denote that you'd like to use it. 

### `thiq.json:verboseLogging`
Either `true` or `false`, this is used to turn those extra debugging logs on or off. To utilize verbose logging, You'll need to `log('my string', 'verbose')`.

### `thiq.json:env`*
This allows you to insert runtime values into the process prior to any specific configuration is loaded and before and libraries are evaluated, which is especially useful 
in environment specific configurations between develop and release targets. All properties here will be set in `global.process.env` for usage, but there are a couple 
blocked variables:
- `serverType`: determined by the server, it'll return a value of the `ServerType` enum (`unknown`, `vanilla`, `spigot`, `bukkit`, or `glowstone` (glowstone is 
not supported yet)).
- `jvmVersion`: this is mostly used for assertions and safety checking. Better safe than sorry!
- `is64bit`: whether or not the JVM is being ran in 64bit.
- `isDebugging`: `true|false`. Whether this true or false adjusts what env keys are loaded globally. If debugging is on, then keys that are prepended with `debug:` will 
be set, else they will be ignored.

```
// an example of an env object
{
    "env": {
        "startup": "startup.js",
        "debug:startup": "startup.debug.js", // this will be chosen over "startup" if debugging is on
        //...
    }
} 
```

### `thiq.json:allowUnsafeCode`*
Thiq will create a watch around all code executed in the environment to see if it may be calling harmful code. This is by default off and removed from the config to prevent 
mistampering with. If this is off, no script will be able to write to any file on the host machine, nor explicitly evaluate any code in any way. It will also restrict access 
to any of Nashorn's types through `require` or directly referencing the Java type. All access to external processes will also be revoked. Because it cannot cover everything 
or a script may require any of these features, it is strongly recommended that you read through the scripts you download if you are unfamiliar with it.

### `thiq.json:enableClientSideScripting`*
Registers the command `/js` for use. By default, it is turned on during debugging and off during release. This value will override it.