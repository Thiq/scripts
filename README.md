# Thiq
>The scripts repository for the Spigot plugin [Thiq](https://github.com/Thiq/Thiq)   

|Dependencies|Version|
|---|---|
|Thiq.jar|v1.0.2+|

Thiq is 1 part Java and 1 part JavaScript. For one to work, one needs the other. Within Thiq, there are core JS libraries that ensure a constant system within the JS environment. "Why not do everything there?" The point of Thiq was to make fast, simple, and scalable solutions for plugin development within Spigot, one that Java does neither fast nor simple. One can say that it's easy to create a plugin, but what steps do you have to take? Create the project, assign dependencies, configure Maven, configure where the src sits at, and you haven't even started coding yet. Thiq makes it simple. It's a simple `create`, `write`, and `reload`. 

### Items of Importance and Loading
When Thiq initializes, it loads the internal core repository, to ensure that nothing funky happens across multiple servers. It allows a consistency, almost like Google's V8 engine (except not because it's not that impressive). The core repository includes things like `logger`, `require`, `promise`, `tts`, `events`, etc. All the core things to allow for a full JS environment. After those are loaded, the following events happen in order:

1: `./Thiq/thiq.json` is read. This contains information about the current environment that we should included in the `process` module, but also what libraries to load into the environment. 
```
{
  "libraries": [
    "myLib.js"
  ]
}
```

2: `./libs/` This is where all of the libraries that affect gameplay are kept (ideally). In reality, you could really keep anything in there, but for the sake of structure, if a library doesn't directly expose an API or is not a module, it goes in this directory.

3: `./modules/` This is where all of the modules reside. If you're doing simple plugins, you most likely won't have to touch anything in here. Any API or ThiqJS module that your library uses will likely reside in here. 

4: `./startup.js` After everything in the `libs` folder is loaded, this file is called. For any plugins or modules that require initialization on startup, this is the file where you wanna do it. Once `startup.js` is finished being called, Thiq is finished loading and is ready for the fight.

## Documentation
Documentation is coming soon&trade;. 
## Contributing
Contributions are always welcome. The main goal is to recreate the NodeJS environment within the JavaEE stack, so core module updates are recommended. To contribute, just pull the code and submit a pull request with ${USERNAME}-{FEATURENAME}.
## License
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2FThiq%2Fscripts.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2FThiq%2Fscripts?ref=badge_large)
