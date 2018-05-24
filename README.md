# Thiq

>The scripts repository for the Spigot plugin [Thiq](https://github.com/Thiq/Thiq)

|Dependencies|Version|
|---|---|
|Thiq.jar|v3.0.0+|

Thiq is 1 part Java and 1 part JavaScript. For one to work, one needs the other. Within Thiq, there are core JS libraries that ensure a constant system within the JS environment. "Why not do everything there?" The point of Thiq was to make fast, simple, and scalable solutions for plugin development within Spigot, one that Java does neither fast nor simple. One can say that it's easy to create a plugin, but what steps do you have to take? Create the project, assign dependencies, configure Maven, configure where the src sits at, and you haven't even started coding yet. Thiq makes it simple. It's a simple `create`, `write`, and `reload`.

## Items of Importance and Loading

If you're familiar with NodeJS, then you'll be able to easily get started with Thiq. It follows the same directory and file structure out of the box, with the intent for a Node developer to easily use this environment with as little hassle as possible. If you're not familiar with Node, then you can either look up how to setup a project in it or read the next section.

### First things first: loading process

When Thiq is initialized, it first creates a compiler to be used. Our environment is then given some methods to allow direct transpiling and execution, but it essentially amounts to the common JS function `eval`. After that's done, the internal JS files are loaded and modules are initialized. These are done to create a Node-replicating environment. Once that is done, the bootstrapper reads from `package.json["main"]` to determine the entry point. If the field doesn't exist, it is defaulted to `index.js` within `plugins/Thiq`.

### The Entry File

Think of this file as the `int main()` of the environment. Once the environment is finished initializing, this is called. Once this file is finished executing, Thiq is considered finished loading. 

### Dependencies

Dependencies are resolved at startup through TPM (Thiq Package Manager). For documentation and tutorials on how to use TPM, [check out the docs](https://docs.thiq.org/). Dependencies that Thiq is allowed to use is installed locally at `package.json["modules_dir"]`. This is unlike Node in the fact that Node is allowed to install packages globally on the host machine.

## [Documentation](http://docs.thiq.org)

## Contributing

Contributions are always welcome. The main goal is to recreate the NodeJS environment within the JavaEE stack, so core module updates are recommended. To contribute, just pull the code and submit a pull request with ${USERNAME}-{FEATURENAME}.

## License

[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2FThiq%2Fscripts.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2FThiq%2Fscripts?ref=badge_large)
