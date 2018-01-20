# Welcome to Thiq's Documents

These docs will teach you how to setup your Thiq environment, adding custom scripts, and create a brand new gameplay for your players. The docs are split up into 4 different parts:
- Setting Up
- Creating A New Library Script
- Create A New Module
- API References (for you nerds out there)

Before we get started, there are a few requirements for Thiq.

_*Ensure Java 8 or higher is installed.*_ Thiq WILL NOT work without this. This is due to Java 8's Nashorn JavaScript engine. 

_*Ensure Spigot is installed for versions 1.11.2 or higher.*_ This hasn't been tested yet for versions below, but I am completely willing to have people submit pull requests on a branch for a higher/lower version. If it works in 1.11.2, chances are it works in 1.12. There are little API differences. 

For those familiar with JS development, Thiq does not yet support ES6. This is due to Nashorn's capabilities. "Why don't you use Babel or another transpiler?" Babel is made for NodeJS, and sadly relies on a lot of packages that aren't currenly supported in Thiq. But have no fear, other languages that don't require NodeJS are already implemented such as CoffeeScript and TypeScript!