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

By calling the function `registerEvent` that's built into Thiq, we're telling it that we want to call something when a certain event happens. 