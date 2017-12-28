# Modules
For those that are familiar with NodeJS, you'll feel comfortable with this section if you haven't already noticed. Thiq follows CommonJS module conventions and standards, passing most tests but also adding a little bit of flavor to it. If you'd like to stick to basic usage, then there's nothing to stop you from doing that.

### So what are modules?
Modules are a way of loading a library only when we need it, but also only calling functions that we allow as well. Modules are all loaded into a smaller scope, so anything declared inside of a module's file stays within that file unless exported.  
_Exported? Wtf is that?_  
Lets take a look at the example of a `music` module:
```
// ./modules/music/index.js
function getFavoriteNote() {
    return 'C#';
}
exports.favoriteNote = getFavoriteNote;
```

```
// in a file far far away but still in the same galaxy
var music = require('music');
console.log(music.favoriteNote());
```
Even though nowhere in the file is `exports` defined, it's defined once we wrap the individual file on load. This allows the developer to remove boilerplate code that would otherwise be non-sensical to write.

_So what else gets injected that we don't see?_  
3 things: 
1: `module` an object of `{ exports, loader, options, isLoaded }`
2: `exports` (it's just `module.exports` but shorthanded)
3: `require`

_Wait wait, why is `require` redefined?_  
When you're not in a module, you can't call `require` on a file directly. You need to do a fully qualified name. This is due to the way all of the scripts are loaded and that the variables `__filename` and `__dirname` aren't native to Nashorn. So if you have 2 files in `/libs/` named `file1.js` and `file2.js`, you need to use `require('./libs/file1')` in order to load it. But when you're in a module, you don't have to do that; you can simply call `require` in relation to the module directory as the parent.

_So, why modules? Why not just have people paste source code in files?_  
Again, this is where those familiar with NodeJS can take advantage of things. If you have a package, you typically want people to use it for an extensible API, boilerplate code, a loader, etc. You want your information to be tied to that package, so each module has it's own `package.json` that gives information on the module that developers can see.

```{
    "name": "GUI",
    "id": "gui",
    "version": "1.0.1",
    "author": {
        "name": "Justin Cox",
        "url": "https://github.com/Conji",
        "email": "hello@thiq.org"
    },
    "license": "MIT_2017",
    "main": "index.js",
    "loader": "javascript", // not necessary if just 'javascript'
    "dependencies": [
        { "underscore": "*" }, // library-name : version (add a '+' to the end for a min version or '-' for max)
        { "event-handlers": "*" }
    ],
    "thiqv": "1.0.0+", // the min Thiq version this module can run on. These shouldn't ever be necessary, but API changes lol
    "scripts: [
        { "test": "./tests/start.js" } // you can call `thiq gui --test` from the command line to test the package
    ]
}
```
