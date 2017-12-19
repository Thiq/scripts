# Loaders
Loaders are a way to use other language compiling services within Thiq, allowing for linting, modification, and compilation of any script. They are used within both `core/loader.js` and `core/require.js`.
## How do I use loaders?
There are 3 ways to use them. 
1: For a consistent loader throughout a module, go into the `package.json` and use the field `loader`:
```
{
	"main": "myFile.ts",
	"loader": "typescript"
}
```
2: For an individual file, simply add it into the `require` options as the second argument.
```
var myFile = require('myModule', { loader: 'typescript' });
```
3: To compile a raw input, you can use the loader function `load('let myString: string = "string"', 'typescript')`

All of these functions will output the compiled JavaScript.
## How do I make a loader?
Most modules (like TypeScript) are compatible with Thiq because they all use the CommonJS style loading for exposing their compile functions. Most, if not all though, require a small tweak to the exports object.

For example, TypeScript requires a modification as such that exposes a function that accepts a consistent compile function:
```
ts.TypeScriptServicesFactory = TypeScriptServicesFactory;
    if (typeof module !== "undefined" && module.exports) {
        module.exports = ts;
        // the exposed compile function
        module.exports.compileFn = function(input) {
            return ts.transpileModule(input, { compilerOptions: { module: ts.ModuleKind.CommonJS }}).outputText;
        }
    }
```
All loaders must have a `.compileFn(input)` function within the exports or else the loader won't work.

The loader file tree must have the name of the loader as the directory name and then `loader.js` as the entry point.