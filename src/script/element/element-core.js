var Selector, Element, prototype,
    // Regular expressions
    whitespace = '\\x20\\t\\r\\n\\f',
    regExp = {
        "ID": '#([\\S]+)',
        'Name': '\\[[' + whitespace + ']*name[' + whitespace + ']*=[' + whitespace + ']*\\"([\\w-]+)\\"[' + whitespace + ']*\\]',
        "Class": '\\.([\\w-]+)',
        'Pseudo': '^(?:([\\:]{1,2})([a-z-]+)(?:\\(([' + whitespace + '\\w-]+)\\))?)$',
        "Element": '(\\w+)',
        "Attribute": '\\[(?:[' + whitespace + ']*(?:[^(name)]|[\\w-]+)[' + whitespace + ']*(?:([*^$|!~]?=)[' + whitespace + ']*\\"([\\S]+)\\"[' + whitespace + ']*)*)\\]',
        "Descendant": '[' + whitespace + ']*(\\x20)[' + whitespace + ']*',
        'Combinators': '[' + whitespace + ']*([>+~])[' + whitespace + ']*',
        'Comma': '(?:([' + whitespace + ']+)([,]+)([' + whitespace + ']+))',
        'Syntax': '(?:([\\:\\.#>\\+~]+)([\\s\\S]+)([^\\:\\.#>\\+~]))'
    };
/**
 * <%= pkg.name %> Element
 * @class Element
 * @constructor
 * @example
 *     var elem = <%= pkg.name %>.Element(selector, context);
 */
_.Element = Element = function (selector, context) {
    return new Selector(selector, context);
};
Element.prototype = prototype = {
    _elements: [],
    constructor: Element,
    selector: null,
    context: null
};