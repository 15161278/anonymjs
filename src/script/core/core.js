/**
 * @namespace <%= pkg.name %>
 */
(function (global) {
    var _cache = {}, _slice = Array.prototype.slice,
        //detect advance browser constructor such as HTMLCollection, NodeList
        _isInstance = function (instance, constructor) {
            return typeof global[constructor] != 'undefined' && instance instanceof global[constructor];
        },
        _isFunction = function (obj) {
            return typeof obj == 'function';
        },
        _isPlainObject = function (obj) {
            return !!obj && typeof obj == 'object' && obj.constructor == Object;
        },
        _isDOMCollection = function (obj) {
            //1. for document.getElementsByTagName and document.getElementsByClassName
            //2. for document.querySelectorAll
            //3. for document.querySelectorAll in ie8
            //4. fix ie7 and below document.getElementsByTagName
            return _isInstance(obj, 'HTMLCollection') || _isInstance(obj, 'NodeList') || _isInstance(obj, 'StaticNodeList') || (!!obj && typeof obj == 'object' && 'length' in obj && 'tags' in obj && 'namedItem' in obj);
        },
        _isArray = function (obj) {
            return Array.isArray(obj);
        },
        _isArrayLike = function (obj) {
            return Array.isArray(obj) || _isDOMCollection(obj);
        };
    /**
     * <%= pkg.name %> core
     * @class Core
     * @static
     */
    global['<%= pkg.name %>'] = {
        /**
         * version
         * @attribute version
         * @readOnly
         * @type String
         */
        version: '<%= pkg.version %>',
        /**
         * If true, all key operation will output to browser console. (ie8 and before will to support this feature)
         * @attribute debug
         * @type Boolean
         * @default false
         */
        debug: false,
        /**
         * ie version
         * @attribute ie
         * @readOnly
         * @type Integer IE version is this or older version
         */
        ie: (function () {
            var doc = document, all = document.all, win = window;
            if (doc.documentMode) {
                return doc.documentMode;
            }
            if (all && !doc.compatMode) {
                return 5;
            }
            if (all && !win.XMLHttpRequest) {
                return 6;
            }
            if (all && !doc.querySelector) {
                return 7;
            }
            if (all && !doc.addEventListener) {
                return 8;
            }
            if (all && !win.atob) {
                return 9;
            }
            if (all) {
                return 10;
            }
        }()),
        /**
         * Copy and extend a new plain object from given plain object
         * @method extend
         * @param {Boolean} [deep] If true, the merge becomes recursive
         * @param {Object} source An object containing additional properties to merge in.
         * @param {Object} [target] The object to extend. It will receive the new properties.
         * @param {Function, RegExp} [filter] The merging condition
         * @example
         *     var result = <%= pkg.name %>.extend({a:'a'},{b:'b',c:'c'}); //{b:'b',c:'c',a:'a'}
         */
        extend: function (/*deep, source, target, filter*/) {
            var self = this, args, key, value, deep = arguments[0] === true, clone, source, fn, reg;
            args = _slice.call(arguments, deep ? 1 : 0);
            source = args.shift();
            clone = _isPlainObject(args[0]) ? args.shift() : {};
            if (_isFunction(args[0])) {
                fn = args.shift();
            } else if (args[0] instanceof RegExp) {
                reg = args.shift();
            }
            for (key in source) {
                value = source[key];
                if (!reg && !fn || !!reg && reg.test(key) || !!fn && fn(key)) {
                    if (deep && _isPlainObject(value)) {
                        clone[key] = self.extend(deep, value);
                    } else if (deep && _isArray(value)) {
                        clone[key] = [].concat(value);
                    } else {
                        clone[key] = value;
                    }
                }
            }
            return clone;
        },
        /**
         * Convert Number or a number like String to a finite number or 0. This method is not equal the parseInt
         * @method numeric
         * @param {Number, String} value Number or string will be convert to numeric.
         * @return {Number}
         * @example
         *     <%= pkg.name %>.numeric('6.6'); //6.6
         *     <%= pkg.name %>.numeric('6.'); //6
         *     <%= pkg.name %>.numeric('.6'); //0.6
         *     <%= pkg.name %>.numeric('6px'); //0
         */
        numeric: function (value) {
            var number;
            if (!value) {
                //return "", false, NaN, null or undefined
                return 0;
            } else if (typeof value == 'number' || typeof value == 'string') {
                number = +value;
                if (!number || !Number.isFinite(number)) {
                    //return " ", "0", "NaN", "Infinity", Infinity, < -2^53 or > 2^53
                    return 0;
                }
                return number;
            } else {
                //return [1] like
                return 0;
            }
        },
        /**
         * Convert Number or a number like String to integer
         * @method integer
         * @param {String, Number} n Number or a number like String
         * @return {Integer}
         * @example
         *     <%= pkg.name %>.integer('6.6');
         */
        integer: function (value) {
            var number = this.numeric(value);
            if (number > -9007199254740992 && number < 9007199254740992) {
                return (number > 0 ? 1 : -1) * Math.floor(Math.abs(number));
            } else {
                throw new TypeError('JavaScript Integer is allowed from -9007199254740992 to 9007199254740992!');
            }
        },
        /**
         * Convert Number or a number like String to a nature number
         * @method nature
         * @param {String, Number} value Number or a number like String
         * @return {Integer}
         * @example
         *     <%= pkg.name %>.nature('6.6');
         */
        nature: function (value) {
            var number = this.numeric(value);
            if (number > -9007199254740992 && number < 9007199254740992) {
                return Math.abs(number);
            } else {
                throw new TypeError('JavaScript Integer is allowed from -9007199254740992 to 9007199254740992!');
            }
        },
        /**
         * Change the word first letter to upper case
         * @method capitalize
         * @param {String} word Word will be capitalize
         * @return {String}
         * @example
         *     <%= pkg.name %>.capitalize('capitalize'); //Capitalize
         *     <%= pkg.name %>.capitalize('camelCase'); //CamelCase
         */
        capitalize: function (word) {
            if (typeof word != 'string') {
                throw new TypeError('<%= pkg.name %>.capitalize(word), "word" is not a string!');
            }
            if (word.length > 0) {
                return word.charAt(0).toUpperCase() + word.slice(1)
            }
            return '';
        },
        /**
         * Detect if the parameter is a function type object
         * @method isFunction
         * @param {Object} fn Test object
         * @return {Boolean}
         * @example
         *     <%= pkg.name %>.isFunction(function(){}); //true
         */
        isFunction: _isFunction,
        /**
         * Detect if the parameter is a plain object (JSON)
         * @method isPlainObject
         * @param {Object} obj Test object
         * @return {Boolean}
         * @example
         *     <%= pkg.name %>.isPlainObject({}); //true
         */
        isPlainObject: _isPlainObject,
        /**
         * Detect if the parameter is a Array like
         * @method isArrayLike
         * @param {Object} obj Test object
         * @return {Boolean}
         * @example
         *     <%= pkg.name %>.isArrayLike([]); //true
         *     <%= pkg.name %>.isArrayLike(document.getElementsByTagName('th')); //true
         *     <%= pkg.name %>.isArrayLike({length: 1, 0:'0'}); //false
         */
        isArrayLike: _isArrayLike,
        /**
         * Detect if the element is a XML element.
         * @method isXML
         * @author http://sizzlejs.com/
         * @param {Object} obj Test object
         * @return {Boolean}
         * @example
         *     <%= pkg.name %>.isXML(document); //false
         */
        isXML: function (elem) {
            var documentElement = elem && (elem.ownerDocument || elem).documentElement;
            return documentElement ? documentElement.nodeName !== "HTML" : false;
        },
        /**
         * Detect if the element is a DOM HTML node
         * @method isNode
         * @param {Object} obj Test object
         * @return {Boolean}
         * @example
         *     <%= pkg.name %>.isNode(document); //true
         *     <%= pkg.name %>.isNode(document.getElementsByTagName('body')[0]); //true
         */
        isNode: function (obj) {
            if (_isInstance(obj, 'Node')) {
                return true;
            } else {
                if (!obj || typeof obj != 'object' || !'nodeName' in obj) {
                    return false;
                }
                //Node.nodeName is read only
                try {
                    obj.nodeName = '';
                    return obj.nodeName !== '';
                } catch (e) {
                    return true;
                }
            }
        },
        /**
         * Detect if the element is a DOM HTML element
         * @method isElementNode
         * @param {Object} obj Test object
         * @return {Boolean}
         * @example
         *     <%= pkg.name %>.isElementNode(document); //false
         *     <%= pkg.name %>.isElementNode(document.getElementsByTagName('body')[0]); //true
         */
        isElementNode: function (obj) {
            return _isInstance(obj, 'HTMLElement') || this.isNode(obj) && obj.nodeType == 1;
        },
        /**
         * Detect if the element is a DOM HTML attribute
         * @method isAttributeNode
         * @param {Object} obj Test object
         * @return {Boolean}
         * @example
         *     <%= pkg.name %>.isAttributeNode(document); //false
         *     <%= pkg.name %>.isAttributeNode(document.getElementsByTagName('body')[0]); //false
         *     <%= pkg.name %>.isAttributeNode(document.getElementsByTagName('body')[0].getAttributeNode('role')); //true
         */
        isAttributeNode: function (obj) {
            return this.isNode(obj) && obj.nodeType == 2;
        },
        /**
         * Detect if the element is a DOM HTML attribute
         * @method isTextNode
         * @param {Object} obj Test object
         * @return {Boolean}
         * @example
         *     <%= pkg.name %>.isTextNode(document); //false
         *     <%= pkg.name %>.isTextNode(document.getElementsByTagName('body')[0]); //false
         */
        isTextNode: function (obj) {
            return this.isNode(obj) && obj.nodeType == 3;
        },
        /**
         * Detect if the element is a DOM Document
         * @method isDocument
         * @param {Object} obj Test object
         * @return {Boolean}
         * @example
         *     <%= pkg.name %>.isDocument(document); //true
         *     <%= pkg.name %>.isDocument(document.getElementsByTagName('body')[0]); //false
         */
        isDocument: function (obj) {
            return this.isNode(obj) && obj.nodeType == 9;
        },
        /**
         * Compare the parameters value if they are equal
         * @method isEqual
         * @param {Object, String, Array} obj Test object
         * @param {Object, String, Array} other Test object
         * @return {Boolean}
         * @example
         *     <%= pkg.name %>.equal(NaN, NaN); //true
         *     <%= pkg.name %>.equal(-0, 0); //false
         *     <%= pkg.name %>.equal([1], [1]); //true
         *     <%= pkg.name %>.equal(new String('a'), 'a'); //true
         *     <%= pkg.name %>.equal({a:'a'}, {a:'a'}); //true
         *     <%= pkg.name %>.equal([], {}); //false
         *     <%= pkg.name %>.equal(new RegExp('a'), /a/); //true
         *     <%= pkg.name %>.equal(new Date(), new Date()); //true (The two Date object millisecond are the same)
         */
        isEqual: function (source, compare) {
            var self = this, key, length, type;
            if (typeof source != typeof compare) {
                return false;
            }
            //fix NaN === NaN -> false
            if (Number.isNaN(source) && Number.isNaN(compare)) {
                return true;
            }
            //fix +0 === -0 -> true
            if (source === 0 && compare === 0) {
                return 1 / source === 1 / compare;
            }
            type = typeof source;
            if (type == 'string' || type == 'number') {
                //compare string and number, and fix new String('123')!=='123', new Number(123)!==123 like issue
                return source == compare;
            } else if (_isArray(source)) {
                //compare array
                if (source.length != compare.length) {
                    //compare array length
                    return false;
                }
                if (!source.length) {
                    //for empty array
                    return true;
                }
                for (key = 0, length = source.length; key < length; key++) {
                    //do element compare
                    if (!self.isEqual(source[key], compare[key])) {
                        return false;
                    }
                }
                return true;
            } else if (_isPlainObject(source)) {
                //compare plainObject
                for (key in source) {
                    //do element compare
                    if (!self.isEqual(source[key], compare[key])) {
                        return false;
                    }
                }
                return true;
            } else if (source instanceof RegExp) {
                //compare RegExp
                return source.toString() === compare.toString();
            } else if (source instanceof Date) {
                //compare Date
                return source.getTime() === compare.getTime();
            } else {
                //compare null, undefined, function
                return source === compare;
            }
        },
        /**
         * Detect if the String, Array or Object is empty
         * @method isEmpty
         * @param {Object, String, Array} obj Test object
         * @return {Boolean}
         * @example
         *     <%= pkg.name %>.isEmpty(null); //false
         *     <%= pkg.name %>.isEmpty(''); //true
         *     <%= pkg.name %>.isEmpty([]); //true
         *     <%= pkg.name %>.isEmpty({}); //true
         */
        isEmpty: function (obj) {
            var key;
            if (typeof obj == 'string' || _isArray(obj)) {
                return obj.length == 0;
            } else if (_isPlainObject(obj)) {
                for (key in obj) {
                    return false;
                }
                return true;
            } else {
                return false;
            }
        },
        /**
         * Detect element in the JavaScript or DOM collection, DOM Node or String.
         * @method contains
         * @param {Array, Object, String, DOM, HTMLCollection, NodeList} container Container will be test.
         * @param {Array, Object, String, DOM} element Element will be test.
         * @return {Boolean}
         * @example
         *     <%= pkg.name %>.contains('javascript', 'script'); //true
         *     <%= pkg.name %>.contains(['java', 'script'], 'script'); //true
         *     <%= pkg.name %>.contains({'language': 'javascript'}, 'script'); //false
         *     <%= pkg.name %>.contains({'language': 'javascript'}, 'javascript'); //true
         *     <%= pkg.name %>.contains(document, document.getElementsByTagName('body')[0]); //true
         */
        contains: function (container, element) {
            var self = this, key, length;
            if (typeof container == 'string') {
                return container.indexOf(element) > -1;
            } else if (_isArray(container) || _isDOMCollection(container)) {
                for (key = 0, length = container.length; key < length; k++) {
                    if (self.isEqual(container[key], element)) {
                        return true;
                    }
                }
                return false;
            } else if (_isPlainObject(container)) {
                for (key in container) {
                    if (self.isEqual(container[key], element)) {
                        return true;
                    }
                }
                return false;
            } else if (this.isElementNode(element)) {
                if (this.isDocument(container)) {
                    return element.ownerDocument === container;
                } else if (this.isElementNode(container)) {
                    if (document.contains) {
                        return container.contains(element);
                    } else if (document.compareDocumentPosition) {
                        return container.compareDocumentPosition(element) & 16;
                    } else {
                        while ((element = element.parentNode)) {
                            if (container === element) {
                                return true;
                            }
                        }
                        return false;
                    }
                } else {
                    return false;
                }
            } else {
                throw  new TypeError('<%= pkg.name %>.contains(container, element), parameters TypeError!');
            }
        },
        /**
         * Return the a new Array with unique value.
         * @method unique
         * @param {Array} arr Array.
         * @param {Boolean} [valueMatch=false] If true unique will match value of the {} and [], otherwise, unique only compare object reference of {}, [].
         * @return {Array}
         * @example
         *     var arr = ['a', 'a', 1, 1, {}, {}, [], [], new RegExp('test'), new RegExp('test')];
         *     console.log(arr); //["a", "a", 1, 1, Object, Object, Array[0], Array[0], /test/, /test/]
         *     console.log(<%= pkg.name %>.unique(arr)); //["a", 1, Object, Object, Array[0], Array[0], /test/, /test/]
         *     console.log(<%= pkg.name %>.unique(arr, true)); //["a", 1, Object, Array[0], /test/]
         */
        unique: function (arr, valueMatch) {
            var self = this, type, ret = [], hash = {
                '+0': false,
                '-0': false,
                'NaN': false,
                'true': false,
                'false': false,
                'null': false,
                'undefined': false,
                'enum': {},
                'object': []
            };
            if (!_isArray(arr)) {
                throw new TypeError()
            }
            function valueUnique(type, val) {
                if (!hash[type]) {
                    hash[type] = [];
                }
                if (!hash[type].length) {
                    hash[type].push(val);
                    ret.push(val);
                }
                hash[type].forEach(function (ref) {
                    if (!self.isEqual(ref, val)) {
                        hash[type].push(val);
                        ret.push(val);
                    }
                });
            }

            arr.forEach(function (value) {
                type = typeof value;
                if (value === null || value === undefined || type == 'boolean') {
                    if (!hash['' + value]) {
                        //fast unique null, undefined, true, false
                        hash['' + value] = true;
                        ret.push(value);
                    }
                } else if (type == 'string' || type == 'number') {
                    if (Number.isNaN(value) && !hash['NaN']) {
                        //fast unique NaN
                        hash['NaN'] = true;
                        ret.push(value);
                    } else if (value === 0) {
                        //fast unique +0 or -0
                        if (1 / value === Infinity && !hash['+0']) {
                            hash['+0'] = true;
                            ret.push(value);
                        }
                        if (1 / value === -Infinity && !hash['-0']) {
                            hash['-0'] = true;
                            ret.push(value);
                        }
                    } else {
                        if (!hash['enum'][value]) {
                            //fast unique string and number
                            hash['enum'][value] = true;
                            ret.push(value);
                        }
                    }
                } else {
                    //unique Object, Array, Date, RegExp etc.
                    if (valueMatch === true) {
                        if (_isArray(value)) {
                            valueUnique('Array', value);
                        } else if (_isPlainObject(value)) {
                            valueUnique('PlainObject', value);
                        } else if (value instanceof Date) {
                            valueUnique('Date', value);
                        } else if (value instanceof RegExp) {
                            valueUnique('RegExp', value);
                        } else {
                            valueUnique('object', value);
                        }
                    } else {
                        if (!hash['object'].length) {
                            hash['object'].push(value);
                            ret.push(value);
                        }
                        if (hash['object'].indexOf(value) == -1) {
                            hash['object'].push(value);
                            ret.push(value);
                        }
                    }
                }
            });
            hash = null;
            return ret;
        },
        /**
         * Return the number of elements in a JavaScript or DOM collection.
         * @method size
         * @param {Array, Object, HTMLCollection, NodeList} collection Array or Object will be test.
         * @return {Integer}
         */
        size: function (collection) {
            if (_isArray(collection) || _isDOMCollection(collection)) {
                return collection.length;
            } else if (_isPlainObject(collection)) {
                return Object.keys(collection).length;
            } else {
                throw new TypeError();
            }
        },
        /**
         * A generic iterator function, which can be used to seamlessly iterate over JavaScript or DOM collection.
         * @method each
         * @param {Array, Object, HTMLCollection, NodeList} collection The collection to iterate over.
         * @param {Function} iterator The function that will be executed.
         * @param {Object} [context=<%= pkg.name %>] The iterator execute context.
         */
        each: function (collection, iterator, context) {
            var key, length;
            if (_isArray(collection)) {
                collection.forEach(iterator, context || this);
            } else if (_isDOMCollection(collection)) {
                for (key = 0, length = collection.length; key < length; key++) {
                    iterator.call(context || this, collection[key], key, collection);
                }
            } else if (_isPlainObject(collection)) {
                for (key in collection) {
                    iterator.call(context || this, collection[key], key, collection);
                }
            } else {
                throw new TypeError('<%= pkg.name %>.each(collection), collection TypeError');
            }
        },
        /**
         * A generic iterator function, which can be used to seamlessly iterate over writable collection of JavaScript or DOM, and return a new collection.
         * @method map
         * @param {Array, Object} collection The collection to iterate over.
         * @param {Function} iterator The function that will be executed.
         * @param {Object} [context=<%= pkg.name %>] The iterator execute context.
         * @return {Array, Object} new array and object.
         */
        map: function (collection, iterator, context) {
            var key, map;
            if (_isArray(collection)) {
                return collection.map(iterator, context || this);
            } else if (_isPlainObject(collection)) {
                map = {};
                for (key in collection) {
                    map[key] = iterator.call(context || this, collection[key], key, collection);
                }
                return map;
            }
        },
        /**
         * Takes a function and returns a new one that will always have a particular context.
         * @method proxy
         * @param {Function} func The function whose context will be changed.
         * @param {Object} [context=<%= pkg.name %>] The object to which the context (this) of the function should be set.
         * @param args Any number of arguments to be passed to the function referenced in the function argument.
         */
        proxy: function (func, context/*, args, ...*/) {
            return arguments.length < 2 || typeof func != 'function' ? new TypeError() : func.apply(context || this, _slice.call(arguments, 2));
        },
        /**
         * Returns a function that will be executed at most one time, no matter how often you call it.
         * @constructor once
         * @param {Function} fn The code will be only run once.
         * @return {Function} Run once function.
         * @example
         *     var once = new <%= pkg.name %>.once(function(args){
             *         console.log(args);
             *     });
         *
         *     once('run!'); //run!
         *     once('run!'); //nothing happened
         *     once('run!'); //nothing happened
         */
        once: function (fn) {
            var already;
            if (typeof fn != 'function') {
                throw new TypeError();
            }
            return function (context/*,args, ...*/) {
                if (already) {
                    return;
                } else {
                    already = true;
                    return fn.apply(context || this, _slice.call(arguments, 1));
                }
            };
        },
        /**
         * Returns a function that, as long as it continues to be invoked, will be triggered at most once during a given wait time.
         * @constructor debounce
         * @param {Function} fn The code will be only run once during a given wait time.
         * @param {Integer} wait The given wait time.
         * @param {Boolean} [immediate=false] If 'immediate' is true, trigger the function on the leading edge, instead of the trailing.
         * @return {Function} Run once function.
         * @example
         *     var debounce1 = <%= pkg.name %>.debounce(function(args){
             *         console.log('debounce1: ' + (Date.now() - args));
             *     }, 1000, true);
         *     var debounce2 = <%= pkg.name %>.debounce(function(args){
             *         console.log('debounce2: ' + (Date.now() - args));
             *     }, 1000);
         *
         *     var t = Date.now();
         *     debounce1(t); //0
         *     debounce2(t); //1000
         */
        debounce: function (fn, wait, immediate) {
            var timeout = null, timestamp;
            if (typeof fn != 'function') {
                throw new TypeError('debounce(func, wait, immediate), parameter "func" is not a function!');
            }
            if (!Number.isInteger(wait)) {
                throw new TypeError('debounce(func, wait, immediate), parameter "wait" is not a integer!');
            }
            return function (/*context, args, ...*/) {
                var args = _slice.call(arguments, 1), context = arguments[0] || this, now, period, next;
                if (!timestamp) {
                    timestamp = Date.now();
                }
                now = Date.now();
                period = now - timestamp;
                if (period >= 0) {
                    if (immediate && !timeout) {
                        return fn.apply(context, args);
                    } else {
                        clearTimeout(timeout);
                        timeout = setTimeout(function () {
                            timeout = null;
                            return fn.apply(context, args);
                        }, period % wait);
                    }
                    timestamp = timestamp + wait;
                }
            };
        },
        /**
         * Timer the <%= pkg.name %>.js messages to console.
         * @constructor timer
         * @param {Function} [test] Condition for the timer
         * @return {Function} timer function.
         * @example
         *     var timer = <%= pkg.name %>.timer();
         *     timer('message!'); //message!
         */
        timer: function (test) {
            var timestamp = Date.now(), debug = global['<%= pkg.name %>'].debug;
            if (typeof test != 'function') {
                throw new TypeError();
            }
            return function (msg/*,args*/) {
                var now, args = _slice.call(arguments, 1);
                if (!debug) {
                    return;
                }
                if (typeof msg != 'string') {
                    throw new TypeError();
                }
                msg = msg.split('|');
                test.apply(this, args);
                if (msg[0] === 'GROUP_START') {
                    console.group(msg[1]);
                } else if (msg[0] === 'GROUP_END') {
                    console.groupEnd();
                } else {
                    now = Date.now();
                    console.log(msg + ': ' + (now - timestamp) + 'ms');
                    timestamp = now;
                }
            }
        },
        /**
         * Cache data.
         * @method cache
         * @param {String} key Cache data map key
         * @param [value] Cache data map value
         * @return {Object}
         * @example
         *     //add new cache
         *     <%= pkg.name %>.cache('global', {
             *         text: 'abc'
             *     });
         *     //load cache data
         *     <%= pkg.name %>.cache('global');
         */
        cache: function (key, value) {
            if (typeof key != 'string') {
                throw new TypeError();
            }
            if (arguments.length > 1) {
                return _cache[key] = {
                    timestamp: Date.now(),
                    data: value
                };
            }
            if (key in _cache) {
                return _cache[key].data;
            }
            return undefined;
        },
        /**
         * Clear cache data.
         * @method recycle
         * @param {String} key Cache data map key
         * @example
         *     //recycle cache data
         *     <%= pkg.name %>.recycle('global');
         */
        recycle: function (key) {
            _cache[key] = null;
            delete _cache[key];
        }
    };
})(this);
