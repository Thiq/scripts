`./core`: where all core JS files are located. These are boilerplate code that allows `lib` and `modules` to load. This will most likely only be updated on Thiq plugin updates.

`./modules`: where all node-like modules are located. These are loaded as packages and can be used via `require`. How to create a package will be down below.

`./lib`: where all game-specific libraries are located. These would be scripts that change gameplay in some manner.

Core files are loaded first, then lib files, while modules are loaded dynamically as needed.

## How to create a Thiq Package:
Your directory can have 2 different layouts. Your package will be searched for via `require` with the same directory name.
`./modules/example/index.js`
`./modules/example/[Filename from package.json[main]]`

### Your package.json layout
While this is not necessary, it is required in order for TPM to serve this package. The layout describes the entry class, the author, the version, hash, and dependencies.
```
/* package.json */
{
  main: "example.js",
  author: "Conji",
  version: "1.0.0",
  hash: "",
  dependencies: [
    name: "fs",
    version: "0.5.2+"
  ]
}
```

### Export your module for use
In order for your module to be used within `require`, follow the CommonJS pattern, similar to NodeJS.
```
function helloWorld() {
  console.log('Hello world!');
}

exports.helloWorld = helloWorld;

// for usage within another file
require('mymodule').helloWorld();
```
### WARNING
While some npm packages are compatible, most may not be. This is due to the fact that Thiq is currently lacking the stdlib of node (WIP). 

### Loading structure:
`plugin.js` is the entry point for Thiq. It loads all of the core libraries and all of the `thiq.json.libraries` array. `startup.js` is used to initialize any code and libraries that needs to be available at runtime.