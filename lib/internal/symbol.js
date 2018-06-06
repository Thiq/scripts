(function webpackUniversalModuleDefinition(root, factory) {
    if (typeof exports === 'object' && typeof module === 'object')
        module.exports = factory();
    else if (typeof define === 'function' && define.amd)
        define([], factory);
    else if (typeof exports === 'object')
        exports["Symbol"] = factory();
    else
        root["Symbol"] = factory();
})(this, function () {
    return /******/ (function (modules) { // webpackBootstrap
        /******/ // The module cache
        /******/
        var installedModules = {};

        /******/ // The require function
        /******/
        function __webpack_require__(moduleId) {

            /******/ // Check if module is in cache
            /******/
            if (installedModules[moduleId])
                /******/
                return installedModules[moduleId].exports;

            /******/ // Create a new module (and put it into the cache)
            /******/
            var module = installedModules[moduleId] = {
                /******/
                i: moduleId,
                /******/
                l: false,
                /******/
                exports: {}
                /******/
            };

            /******/ // Execute the module function
            /******/
            modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

            /******/ // Flag the module as loaded
            /******/
            module.l = true;

            /******/ // Return the exports of the module
            /******/
            return module.exports;
            /******/
        }


        /******/ // expose the modules object (__webpack_modules__)
        /******/
        __webpack_require__.m = modules;

        /******/ // expose the module cache
        /******/
        __webpack_require__.c = installedModules;

        /******/ // identity function for calling harmony imports with the correct context
        /******/
        __webpack_require__.i = function (value) {
            return value;
        };

        /******/ // define getter function for harmony exports
        /******/
        __webpack_require__.d = function (exports, name, getter) {
            /******/
            if (!__webpack_require__.o(exports, name)) {
                /******/
                Object.defineProperty(exports, name, {
                    /******/
                    configurable: false,
                    /******/
                    enumerable: true,
                    /******/
                    get: getter
                    /******/
                });
                /******/
            }
            /******/
        };

        /******/ // getDefaultExport function for compatibility with non-harmony modules
        /******/
        __webpack_require__.n = function (module) {
            /******/
            var getter = module && module.__esModule ?
                /******/
                function getDefault() {
                    return module['default'];
                } :
                /******/
                function getModuleExports() {
                    return module;
                };
            /******/
            __webpack_require__.d(getter, 'a', getter);
            /******/
            return getter;
            /******/
        };

        /******/ // Object.prototype.hasOwnProperty.call
        /******/
        __webpack_require__.o = function (object, property) {
            return Object.prototype.hasOwnProperty.call(object, property);
        };

        /******/ // __webpack_public_path__
        /******/
        __webpack_require__.p = "";

        /******/ // Load entry module and return exports
        /******/
        return __webpack_require__(__webpack_require__.s = 17);
        /******/
    })
    /************************************************************************/
    /******/
    ([
        /* 0 */
        /***/
        (function (module, exports, __webpack_require__) {

            "use strict";


            var validTypes = {
                object: true,
                symbol: true
            };

            module.exports = function () {
                var symbol;
                if (typeof Symbol !== 'function') return false;
                symbol = Symbol('test symbol');
                try {
                    String(symbol);
                } catch (e) {
                    return false;
                }

                // Return 'true' also for polyfills
                if (!validTypes[typeof Symbol.iterator]) return false;
                if (!validTypes[typeof Symbol.toPrimitive]) return false;
                if (!validTypes[typeof Symbol.toStringTag]) return false;

                return true;
            };

            /***/
        }),
        /* 1 */
        /***/
        (function (module, exports, __webpack_require__) {

            "use strict";
            // ES2015 Symbol polyfill for environments that do not (or partially) support it



            var d = __webpack_require__(4),
                validateSymbol = __webpack_require__(3),
                create = Object.create,
                defineProperties = Object.defineProperties,
                defineProperty = Object.defineProperty,
                objPrototype = Object.prototype,
                NativeSymbol,
                SymbolPolyfill,
                HiddenSymbol,
                globalSymbols = create(null),
                isNativeSafe;

            if (typeof Symbol === 'function') {
                NativeSymbol = Symbol;
                try {
                    String(NativeSymbol());
                    isNativeSafe = true;
                } catch (ignore) {}
            }

            var generateName = function () {
                var created = create(null);
                return function (desc) {
                    var postfix = 0,
                        name,
                        ie11BugWorkaround;
                    while (created[desc + (postfix || '')]) ++postfix;
                    desc += postfix || '';
                    created[desc] = true;
                    name = '@@' + desc;
                    defineProperty(objPrototype, name, d.gs(null, function (value) {
                        // For IE11 issue see:
                        // https://connect.microsoft.com/IE/feedbackdetail/view/1928508/
                        //    ie11-broken-getters-on-dom-objects
                        // https://github.com/medikoo/es6-symbol/issues/12
                        if (ie11BugWorkaround) return;
                        ie11BugWorkaround = true;
                        defineProperty(this, name, d(value));
                        ie11BugWorkaround = false;
                    }));
                    return name;
                };
            }();

            // Internal constructor (not one exposed) for creating Symbol instances.
            // This one is used to ensure that `someSymbol instanceof Symbol` always return false
            HiddenSymbol = function Symbol(description) {
                if (this instanceof HiddenSymbol) throw new TypeError('Symbol is not a constructor');
                return SymbolPolyfill(description);
            };

            // Exposed `Symbol` constructor
            // (returns instances of HiddenSymbol)
            module.exports = SymbolPolyfill = function Symbol(description) {
                var symbol;
                if (this instanceof Symbol) throw new TypeError('Symbol is not a constructor');
                if (isNativeSafe) return NativeSymbol(description);
                symbol = create(HiddenSymbol.prototype);
                description = description === undefined ? '' : String(description);
                return defineProperties(symbol, {
                    __description__: d('', description),
                    __name__: d('', generateName(description))
                });
            };
            defineProperties(SymbolPolyfill, {
                for: d(function (key) {
                    if (globalSymbols[key]) return globalSymbols[key];
                    return globalSymbols[key] = SymbolPolyfill(String(key));
                }),
                keyFor: d(function (s) {
                    var key;
                    validateSymbol(s);
                    for (key in globalSymbols)
                        if (globalSymbols[key] === s) return key;
                }),

                // To ensure proper interoperability with other native functions (e.g. Array.from)
                // fallback to eventual native implementation of given symbol
                hasInstance: d('', NativeSymbol && NativeSymbol.hasInstance || SymbolPolyfill('hasInstance')),
                isConcatSpreadable: d('', NativeSymbol && NativeSymbol.isConcatSpreadable || SymbolPolyfill('isConcatSpreadable')),
                iterator: d('', NativeSymbol && NativeSymbol.iterator || SymbolPolyfill('iterator')),
                match: d('', NativeSymbol && NativeSymbol.match || SymbolPolyfill('match')),
                replace: d('', NativeSymbol && NativeSymbol.replace || SymbolPolyfill('replace')),
                search: d('', NativeSymbol && NativeSymbol.search || SymbolPolyfill('search')),
                species: d('', NativeSymbol && NativeSymbol.species || SymbolPolyfill('species')),
                split: d('', NativeSymbol && NativeSymbol.split || SymbolPolyfill('split')),
                toPrimitive: d('', NativeSymbol && NativeSymbol.toPrimitive || SymbolPolyfill('toPrimitive')),
                toStringTag: d('', NativeSymbol && NativeSymbol.toStringTag || SymbolPolyfill('toStringTag')),
                unscopables: d('', NativeSymbol && NativeSymbol.unscopables || SymbolPolyfill('unscopables'))
            });

            // Internal tweaks for real symbol producer
            defineProperties(HiddenSymbol.prototype, {
                constructor: d(SymbolPolyfill),
                toString: d('', function () {
                    return this.__name__;
                })
            });

            // Proper implementation of methods exposed on Symbol.prototype
            // They won't be accessible on produced symbol instances as they derive from HiddenSymbol.prototype
            defineProperties(SymbolPolyfill.prototype, {
                toString: d(function () {
                    return 'Symbol (' + validateSymbol(this).__description__ + ')';
                }),
                valueOf: d(function () {
                    return validateSymbol(this);
                })
            });
            defineProperty(SymbolPolyfill.prototype, SymbolPolyfill.toPrimitive, d('', function () {
                var symbol = validateSymbol(this);
                if (typeof symbol === 'symbol') return symbol;
                return symbol.toString();
            }));
            defineProperty(SymbolPolyfill.prototype, SymbolPolyfill.toStringTag, d('c', 'Symbol'));

            // Proper implementaton of toPrimitive and toStringTag for returned symbol instances
            defineProperty(HiddenSymbol.prototype, SymbolPolyfill.toStringTag, d('c', SymbolPolyfill.prototype[SymbolPolyfill.toStringTag]));

            // Note: It's important to define `toPrimitive` as last one, as some implementations
            // implement `toPrimitive` natively without implementing `toStringTag` (or other specified symbols)
            // And that may invoke error in definition flow:
            // See: https://github.com/medikoo/es6-symbol/issues/13#issuecomment-164146149
            defineProperty(HiddenSymbol.prototype, SymbolPolyfill.toPrimitive, d('c', SymbolPolyfill.prototype[SymbolPolyfill.toPrimitive]));

            /***/
        }),
        /* 2 */
        /***/
        (function (module, exports, __webpack_require__) {

            "use strict";


            module.exports = function (x) {
                if (!x) return false;
                if (typeof x === 'symbol') return true;
                if (!x.constructor) return false;
                if (x.constructor.name !== 'Symbol') return false;
                return x[x.constructor.toStringTag] === 'Symbol';
            };

            /***/
        }),
        /* 3 */
        /***/
        (function (module, exports, __webpack_require__) {

            "use strict";


            var isSymbol = __webpack_require__(2);

            module.exports = function (value) {
                if (!isSymbol(value)) throw new TypeError(value + " is not a symbol");
                return value;
            };

            /***/
        }),
        /* 4 */
        /***/
        (function (module, exports, __webpack_require__) {

            "use strict";


            var assign = __webpack_require__(5),
                normalizeOpts = __webpack_require__(12),
                isCallable = __webpack_require__(8),
                contains = __webpack_require__(14)

                ,
                d;

            d = module.exports = function (dscr, value /*, options*/ ) {
                var c, e, w, options, desc;
                if ((arguments.length < 2) || (typeof dscr !== 'string')) {
                    options = value;
                    value = dscr;
                    dscr = null;
                } else {
                    options = arguments[2];
                }
                if (dscr == null) {
                    c = w = true;
                    e = false;
                } else {
                    c = contains.call(dscr, 'c');
                    e = contains.call(dscr, 'e');
                    w = contains.call(dscr, 'w');
                }

                desc = {
                    value: value,
                    configurable: c,
                    enumerable: e,
                    writable: w
                };
                return !options ? desc : assign(normalizeOpts(options), desc);
            };

            d.gs = function (dscr, get, set /*, options*/ ) {
                var c, e, options, desc;
                if (typeof dscr !== 'string') {
                    options = set;
                    set = get;
                    get = dscr;
                    dscr = null;
                } else {
                    options = arguments[3];
                }
                if (get == null) {
                    get = undefined;
                } else if (!isCallable(get)) {
                    options = get;
                    get = set = undefined;
                } else if (set == null) {
                    set = undefined;
                } else if (!isCallable(set)) {
                    options = set;
                    set = undefined;
                }
                if (dscr == null) {
                    c = true;
                    e = false;
                } else {
                    c = contains.call(dscr, 'c');
                    e = contains.call(dscr, 'e');
                }

                desc = {
                    get: get,
                    set: set,
                    configurable: c,
                    enumerable: e
                };
                return !options ? desc : assign(normalizeOpts(options), desc);
            };


            /***/
        }),
        /* 5 */
        /***/
        (function (module, exports, __webpack_require__) {

            "use strict";


            module.exports = __webpack_require__(6)() ?
                Object.assign :
                __webpack_require__(7);


            /***/
        }),
        /* 6 */
        /***/
        (function (module, exports, __webpack_require__) {

            "use strict";


            module.exports = function () {
                var assign = Object.assign,
                    obj;
                if (typeof assign !== 'function') return false;
                obj = {
                    foo: 'raz'
                };
                assign(obj, {
                    bar: 'dwa'
                }, {
                    trzy: 'trzy'
                });
                return (obj.foo + obj.bar + obj.trzy) === 'razdwatrzy';
            };


            /***/
        }),
        /* 7 */
        /***/
        (function (module, exports, __webpack_require__) {

            "use strict";


            var keys = __webpack_require__(9),
                value = __webpack_require__(13)

                ,
                max = Math.max;

            module.exports = function (dest, src /*, …srcn*/ ) {
                var error, i, l = max(arguments.length, 2),
                    assign;
                dest = Object(value(dest));
                assign = function (key) {
                    try {
                        dest[key] = src[key];
                    } catch (e) {
                        if (!error) error = e;
                    }
                };
                for (i = 1; i < l; ++i) {
                    src = arguments[i];
                    keys(src).forEach(assign);
                }
                if (error !== undefined) throw error;
                return dest;
            };


            /***/
        }),
        /* 8 */
        /***/
        (function (module, exports, __webpack_require__) {

            "use strict";
            // Deprecated



            module.exports = function (obj) {
                return typeof obj === 'function';
            };


            /***/
        }),
        /* 9 */
        /***/
        (function (module, exports, __webpack_require__) {

            "use strict";


            module.exports = __webpack_require__(10)() ?
                Object.keys :
                __webpack_require__(11);


            /***/
        }),
        /* 10 */
        /***/
        (function (module, exports, __webpack_require__) {

            "use strict";


            module.exports = function () {
                try {
                    Object.keys('primitive');
                    return true;
                } catch (e) {
                    return false;
                }
            };


            /***/
        }),
        /* 11 */
        /***/
        (function (module, exports, __webpack_require__) {

            "use strict";


            var keys = Object.keys;

            module.exports = function (object) {
                return keys(object == null ? object : Object(object));
            };


            /***/
        }),
        /* 12 */
        /***/
        (function (module, exports, __webpack_require__) {

            "use strict";


            var forEach = Array.prototype.forEach,
                create = Object.create;

            var process = function (src, obj) {
                var key;
                for (key in src) obj[key] = src[key];
            };

            module.exports = function (options /*, …options*/ ) {
                var result = create(null);
                forEach.call(arguments, function (options) {
                    if (options == null) return;
                    process(Object(options), result);
                });
                return result;
            };


            /***/
        }),
        /* 13 */
        /***/
        (function (module, exports, __webpack_require__) {

            "use strict";


            module.exports = function (value) {
                if (value == null) throw new TypeError("Cannot use null or undefined");
                return value;
            };


            /***/
        }),
        /* 14 */
        /***/
        (function (module, exports, __webpack_require__) {

            "use strict";


            module.exports = __webpack_require__(15)() ?
                String.prototype.contains :
                __webpack_require__(16);


            /***/
        }),
        /* 15 */
        /***/
        (function (module, exports, __webpack_require__) {

            "use strict";


            var str = 'razdwatrzy';

            module.exports = function () {
                if (typeof str.contains !== 'function') return false;
                return ((str.contains('dwa') === true) && (str.contains('foo') === false));
            };


            /***/
        }),
        /* 16 */
        /***/
        (function (module, exports, __webpack_require__) {

            "use strict";


            var indexOf = String.prototype.indexOf;

            module.exports = function (searchString /*, position*/ ) {
                return indexOf.call(this, searchString, arguments[1]) > -1;
            };


            /***/
        }),
        /* 17 */
        /***/
        (function (module, exports, __webpack_require__) {

            "use strict";


            module.exports = __webpack_require__(0)() ? Symbol : __webpack_require__(1);

            /***/
        })
        /******/
    ]);
});