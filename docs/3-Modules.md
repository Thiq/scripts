# Modules
Modules are the core as to what makes Thiq great. For you to use modules, you have to have the `plugins/Thiq/modules` folder. Typically with your Thiq install, this should be created automatically along with the `plugins/Thiq/modules/.bin` folder. This is where the Thiq decides the mandatory modules for running the plugin. If you're a Node developer, think of this folder as your project's `node_modules` folder. 

## Referencing Modules
To reference a module, simply call `require('MODULE_NAME')`. It _must match_ what the directory name is. All modules are unloaded until a script calls it, then it is loaded into a module cache. 

## Creating A New Module
Thiq modules follow the same directory structure as NodeJS modules. Lets use the `async` module as a reference.

If we plan on calling `require('async')`, we need to have a module named `async`. Thiq will locate a directory with the title `async` and then load as required. If the directory contains the file `package.json` and has the field `main`, then it'll load the file dictated by that field. An example of a `package.json` is here:
```
{
    "main": "index.js"
}
```
If the entry file is called `index.js`, there's no need to have the `main` field within the package description, as Thiq will load it automatically. This will only happen though if there is no `main` field within the package description. That means that if we have `index.js` and the `package.json` declared the entrance as another file, it'll choose the file the package description says over `index.js`. 

Once we create our entry file, we create module exports to be used. Like in NodeJS, we do this by using the `exports` object, like such:
```
//async module
exports.runAsync = function () {
    //...
}
```
You can also use `module.exports` if you'd like, but it isn't required _unless_ the module is meant to be used as a function. This means if you'd like to `var async = require('async'); async(function()) {}`, then you can use `module.exports` like such:
```
module.exports = function () {
    //...
}
```
You can also set the `default` exports field:
```
exports.default = function () {
    //...
}
```
This is to more or less incorporate TypeScript functionality, but it carries over to regular JS files as well.

## Using Modules
Lets look back at the `async` module. This module allows us to run tasks asynchronously. To take advantage of this module, lets look at the example.
```
var async = require('async');

async(function() {
    console.log('This function was called via async!');
});
```
By using `require`, we tell Thiq that we'd like to use that module. Remember, all modules are cached until called once. 

## Loading Sub-module Files
As with requiring library file, when we use `require` within a module, it's in reference to that module's directory. If we have a folder named `types` within the module's directory, we have to `require('./types/filename')` no matter where we're at. 