# Libraries
Libraries in Thiq are where all the magic happens. Think of them as plugins for Thiq itself, allowing you to change gameplay for all players. Even if you have no coding experience, here might be the place where you learn cause it's stupid simple.

## Creating A New Library
Lets start with the basics. In the `plugins/Thiq/libs` folder (create it if you don't have it), make a new file `greeting.js`. I'm going to teach you how to create a plugin that greets a player when they login. Trust me, it's a lot easier than it sounds.

_1: Open the file._ 
This sounds stupid, but some people forget. Once you're in the file, it should be blank. If it's not, clear it. It has to be a blank slate.

_2: Create the event handler._ 
Scary right? Don't worry, it's simple. Just simply write (or copy and paste) this into the file:
```
registerEvent(player, 'join', function (e) {

});
```
Now, _what the hell is going on?_ Lets break it down.

By calling the function `registerEvent` that's built into Thiq, we're telling it that we want to call something when a certain event happens. In this case, we want `PlayerEvents`, so we signify that by using the `player` object. 

Next we have the second argument, 'join'. I think you can figure out what this means. We're waiting for a `player` object to call the `PlayerJoin` event. Put simple, we're telling Thiq what the name of the event we're watching for should be called.

Finally, we have the handler function. This function has the `eventArgs` object passed to it. Easy.

_3: Send a message to the player that logged in._ 
Now, all of the code will go within the registered handler. To get the player that logged in, simply use:
```
...
var player = e.getPlayer();
...
```
Remember, the objects passed into the handler in the Java version is the same as in the JavaScript version. This means that to send a new join message to the player, we can use: 
```
...
player.sendMessage("Welcome to the server!");
...
```
_4: Add the library to the `.json`._ 
In `thiq.json`, lets add the JS file to the libraries array to be loaded. It should now look like this:
```
{
    "libraries": [
        "greetings.js"
    ]
}
```
If you're confused about how the code should look, the `greetings.js` file should look like this:
```
registerEvent(player, 'join', function(e) {
    var player = e.getPlayer();
    player.sendMessage("Welcome to the server!");
});
```
## Adding references to other libraries
While this may not be used in your average script, it's also useful to know. Thiq incorporates NodeJS's `module` system, but libraries handle it a little differently. When using `require` within libraries, if you're referencing a module, it works as expected. This means that if you have the `async` module installed, you can call `require('async')` and it'll work fine. But if you try to reference a file directly from a library file, there's a few things to know:

1: All files are relative to the `libs` folder. If you intend to `require` a specific file from a library file, you must use `require('./libs_file.js')`.

2:  `__filename` and `__dirname` is not passed to a library file as expected simply because of the dynamic loading the Thiq requires. This is the reason #1 happens.

3: All library scripts are loaded in a wrapped function call. Any variables set in the library script will not apply globaly. To do this, you need to use `global.variableName` or `global.functioName` to implement to the global scope. 

Now, we move on to making modules!
