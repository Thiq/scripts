# Getting Started 
## Setting up your environment
Before you get started with Thiq, you need to make sure that your environment is setup. All of the core folders are here, but we also need to make sure we're configured properly. If you're a beginner, you shouldn't be touching any of the files in `/core` or `/modules`. If you're seasoned, it's still recommended that you don't touch `/core` just because it's the back-end for the plugin. That being said, if there's anything you'd like to add to startup, you can simply modify `./startup.js` in the Thiq directory. That is called after all of the `core` and `libs` scripts have been called. 

Currently, here's your basic directory structure:
```
|--- /core/
|
|----/libs/
|
|----/loaders/
|
|----/modules/
|
|----/config.yml // declares the entry file
|----/plugin.js // entry file. Typically loads the core files
|----/startup.js // called after plugin.js loads the cores and libs
|----/thiq.json // contains information that Thiq uses regarding libs, options, etc.
```
## Writing your first script
Creating a script is simple; a lot more than in Java. Lets create a plugin that welcomes a player whenever they join the server. 
```
// ./libs/welcome-message.js
registerEvent(player, 'join', function(event) {
    event.getPlayer().sendMessage("Welcome to the server!");
});
```
```
// ./thiq.json
{
    "libraries": [
        "welcome-message.js"
    ]
}
```
_Now, wtf is going on here?_
It's pretty simple. `registerEvent` is a global function that registers an event handler. It then takes 3 args:
1: `handler`; the target handler type. Options are things like `player`, `entity`, `window`, etc.
2: `eventname`; the name of the event name being called in the handler. So if you're trying to handle a PlayerJoinEvent, you'd pass `player, 'join'` like up top in the example!
3: `callback`; the callback to execute when the event is triggered. It takes a single argument of the event data. It can be named `event`, `e`, or whatever you want. Just be consistent and legible.

So how's all that feel? Simple, right? Even those that don't know JavaScript can see what's going on here. In the following examples, we'll see how to do some cooler things from custom interaction logic, custom GUIs, and more.