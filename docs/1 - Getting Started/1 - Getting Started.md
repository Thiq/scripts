# Getting Started

## Why Thiq?
Before we continue, there might be this hanging question you want to ask: "why Thiq?" There's a couple of other JavaScript environments for Spigot, namely (ScriptCraft)[https://github.com/walterhiggins/ScriptCraft]. While ScriptCraft is great in it's own right, it lacks one main thing: the JS environment. 

"But it uses the same JS engine yours does!"

Well, yes. All Java applications that use JS require the Nashorn JavaScript engine (unless it's Java 7 or lower, then it uses Rhino). What I mean by this is that it doesn't really create the JS environment. If you'd like more info, check out (my blog post here)[https://imnot.svbtle.com/typeof-javascript-typeof-java]. Thiq is targeted for those who _know_ JavaScript, but don't want to deal with the bs that Java brings. ScriptCraft does this, but it doesn't really give developers the toolset that Thiq does.

"What do you mean? Can't developers just make the toolset?"

Yes, but we really like it when we don't have to adjust our norms to certain environments. What I mean by this is that the average developer doesn't want to go through and learn how to make what they have work with what they're targeting. It's like having to rewrite an essay for a certain professor. The professor should be able to understand what it is you're saying.

"So what does Thiq have that other environments don't?"

I feel like I'm referencing ScriptCraft a lot here, but for good reason. For a little backstory, I first started working with PlugJS back in 2012ish (Minecraft version 1.2.5, if that puts it in perspective). It was basic, but it worked. After a while, we stopped maintaining it. Bigger projects came, life happened, etc. But in 2017 when I started to plan a (new server)[http://thiq.org], I realized that PlugJS was not gonna work. So I started looking for other JS plugins for Spigot. I came across ScriptCraft, but it was lacking something. Myself, as a web developer, was hoping for a better JS environment. I thought "I can either make a set of plugins for ScriptCraft geared towards web developers like myself, or I can bring back PlugJS and _make it_ what someone like myself would need". And thus Thiq was born. What this meant was creating an environment that would seem familiar to web/NodeJS developers. This meant implementing things like modules, web compatibility, etc. For example, ScriptCraft implements basic NodeJS module capabilities, but in an inconsistent manner. A NodeJS developer could come in and use it, but also be confused by it. They'd have to adjust. So I created one where they wouldn't have to (or at least too much). Some slight variations in Thiq and NodeJS are the `package.json` layout, but I won't get into details about that here. All you need to know is that it's true to the NodeJS style environment.  The complete end goal is to re-implement NodeJS in Java so that anything that's in NodeJS can be used in Java (and by inheritence, Spigot). So what does Thiq have that others don't? A whole system. It's not just an extension to Java as others are.

## Installing Thiq
This section will go over the short and painless install process for Thiq. 

1: as with every spigot plugin, drag and drop `Thiq.jar` into your plugins directory. The core JS components and libraries that allow Thiq to run are embeded within the `.jar` file, so don't worry about any of those.

2: create the file `thiq.json` within the Thiq plugin directory. This is typically found in `plugins/Thiq`, so it should look like `plugins/Thiq/thiq.json`. This filetype is similar to a YML file in the fact that it's used for configuration, but it more friendly on the eyes. 

3: create the file `startup.js` within the Thiq plugin directory. It should be next to the `thiq.json`. This file is called after Thiq has finished startup, so any modules or libraries that need initialization should go here.

That's it! Simple, right? Thiq doesn't need a `config.yml` because the JS does all the configuration for it (which isn't a lot, really).

## Installing Dependencies 
A lot of scripts require dependencies so developers don't have to "remake the wheel" and things are kept in sync. This is done through what's called "modules". These are all located in `plugins/Thiq/modules`. How to install the modules is currently being worked on, so for now you'll have to download the modules from [the main repo](https://github.com/Thiq/scripts). The goal is to have all libraries automatically install on plugin startup though.

## Adding Thiq Scripts
Each script that runs inside Thiq that modifies gameplay in some way is located in `plugins/Thiq/libs`. But even though they are in that folder, you still need to tell Thiq to load it. We do that through the `thiq.json` file that we made in the beginning. Lets say you downloaded and put a file in the libs folder named `welcome.js`. That means are `thiq.json` file should look exactly like this: 
```
{
    "libraries": [
        "welcome.js"
    ]
}
```
To add more libraries, can simply use:
```
"libraries: [
    "welcome.js",
    "mycoolscript.js",
    "myotherscript.js"
]
```
Thiq loads these files in the order that you place them in, as to ensure that one file isn't loaded ahead of another. 

Now, we'll continue on how to make new scripts for your server to use.