var vendorStyleName = function (elem, name) {
    var camel, style = elem.style;
    if (name == 'float') {
        return 'cssFloat' in style ? 'cssFloat' : 'styleFloat';
    } else {
        if (name in style) {
            return name;
        } else if ((camel = name.split('-').map(function (word, idx) {
            return idx < 1 ? word : word.charAt(0).toUpperCase() + word.slice(1);
        }).join('')) in style) {
            return camel;
        }
    }
};
prototype = _.extend({
    /**
     * Access the DOM element(s) style. It always gets the style of the first element of the query element(s), but you can set the new  style to all query element(s).
     * Inspired by jQuery
     * @method css
     * @param {String} name The css style name.
     * @param {String} [value] The css style value.
     * @return {String, Element} If set element value, return the elements, or return the css value.
     * @example
     *     var element = <%= pkg.name %>.Element(selector);
     *     element.css(name); //return the query css style
     *     element.css(name, value); //return the element and set new style to css
     */
    css: function (/*name[, value]*/) {
        var self = this, arg = arguments, name, getter = function (elem, name) {
            var style;
            if (window.getComputedStyle) {
                style = elem.ownerDocument.defaultView.getComputedStyle(elem, null);
            } else if (document.documentElement.currentStyle) {
                style = elem.currentStyle;
            }
            return style[name];
        }, setter = function (name, value) {
            accessArrayLike(self, function (dom) {
                dom.style[vendorStyleName(dom, name)] = value;
            });
        };
        if (typeof arg[0] == 'string') {
            name = vendorStyleName(self[0], arg[0]);
            if (arg.length > 1) {
                setter(name, arg[1]);
                return self;
            }
            return getter(self[0], name);
        } else if (_.isPlainObject(arg[0])) {
            _.each(arg[0], function (value, name) {
                setter(name, value);
            });
        } else {
            throw new TypeError('Element.css() TypeError!');
        }
    },
    /**
     * Access the DOM element(s) property. It always gets the property of the first element of the query element(s), but you can set the new property to all query element(s).
     * Inspired by jQuery
     * @method prop
     * @param {String} name The DOM element property name.
     * @param {String} [value] DOM element property value.
     * @return {String, undefined} The DOM element property value.
     * @example
     *     <%= pkg.name %>.css(element, elementAttr);
     */
    prop: function (name, value) {
        var element, nodeName, nodeType, tabIndex, attr;
        if (typeof name != 'string') {
            throw  new TypeError();
        }
        if (name === 'for') {
            name = 'htmlFor';
        }
        if (name === 'class') {
            name = 'className';
        }
        if (value !== undefined) {
            //set property:
            if (name === 'tabIndex' && this.ie > 7) {
                element.setAttribute('tabindex', value);
            } else if (this.ie < 8) {
                if ((nodeName == 'input' && (name == 'value' || name == 'checked')) || (nodeName == 'option' && name == 'selected')) {
                    element['default' + this.capitalize(name)] = element[name] = value;
                } else {
                    // Use this for any attribute in IE6/7
                    // This fixes almost every IE6/7 issue
                    // Set the existing or create a new attribute node
                    attr = element.getAttributeNode(name);
                    if (!attr) {
                        element.setAttributeNode(
                            (attr = element.ownerDocument.createAttribute(name))
                        );
                    }
                    attr.value = value += "";
                }
            } else {
                element.setAttribute(name, value);
            }
            //remove attr such like checked, selected etc. when set to false
            if (rBooleanAttr.test(name) && value === false || value === 'false') {
                this.removeProp(element, name);
            }
            return value;
        } else {
            element = this[0];
            nodeName = element.nodeName.toLowerCase();
            nodeType = element.nodeType;
            // Only get properties for Node or Document
            if (nodeType != 1 || nodeType != 9) {
                return undefined;
            }
            //get property:
            if (name === 'tabIndex') {
                //fix tabIndex issue:  http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
                tabIndex = element.tabIndex;
                return tabIndex ? parseInt(tabIndex, 10) : /^(?:input|select|textarea|button|object)$/i.test(nodeName) || (/^(?:a|area)$/i.test(nodeName) && element.href) ? 0 : -1;
            } else if (this.ie < 10 && (name === 'href' || name === 'src')) {
                // Make sure that URLs aren't manipulated
                // (IE normalizes it by default)
                return element.getAttribute(name, 4);
            } else {
                return element.getAttribute(name);
            }
        }
    },
    /**
     * Remove the DOM element property
     * @method removeProp
     * @param {String} name The DOM element property name.
     * @return {Boolean} Return the attribute if it was successfully removed.
     */
    removeProp: function (name) {
        if (typeof name != 'string') {
            throw  new TypeError();
        }
        accessArrayLike(this, function (elem) {
            if (elem.nodeType == 1) {
                return elem.removeAttribute(name);
            }
        });
        return false;
    },
    /**
     * Access the mouse cursor position.
     * @method cursor
     * @param {DOM Object} element The DOM element.
     * @param {Integer} [position=element.value.length] The cursor position will be set to the element.
     * @return {Integer}
     */
    cursor: function (element, position) {
        var range;
        if (arguments.length > 1) {
            position = Math.min(this.integer(position), element.value.length);
        } else {
            position = element.value.length;
        }
        if (element.createTextRange) { // IE
            if (arguments.length > 0) {
                var range = element.createTextRange();
                range.moveStart('character', position);
                range.moveEnd('character', position);
                range.collapse(true);
                range.select();
                return position;
            } else {
                var range = document.selection.createRange();
                range.setEndPoint('StartToStart', element.createTextRange());
                return range.text.length;
            }
        } else if (typeof element.selectionStart) { // Firefox
            if (arguments.length > 0) {
                element.setSelectionRange(position, position);
                element.focus();
                return position;
            } else {
                return element.selectionStart;
            }
        }
    },
    /**
     * Replace the tag content in given html string with a wrapper content.
     * @method wrap
     * @param {String} html The given html string.
     * @param {String} tag The query tag name.
     * @param {String} [before] The wrapper content before the query tag content.
     * @param {String} [after] The wrapper content after the query tag content.
     * @return {String} The wrapped content
     * @example
     *     var html = '<div class="outer"><span class="inner"></span></div>';
     *     <%= pkg.name %>.htmlWrap(html, 'span', '<span class="ui-icon ui-icon-left"></span>', '<span class="ui-icon ui-icon-right"></span>'); //<div class="outer"><span class="ui-icon ui-icon-left"></span><span class="inner"></span><span class="ui-icon ui-icon-right"></span></div>
     */
    wrap: function (html, tag, before, after) {
        var query = new RegExp('<' + tag + '([^>]*?)>([\s\S]*?)</' + tag + '>', 'g')
        return html.replace(query, '<' + tag + '$1>' + (!before ? '' : before) + '$2' + (!after ? '' : after) + '</' + tag + '>');
    }
}, prototype);