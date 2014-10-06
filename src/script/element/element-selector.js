var accessArrayLike = function (obj/*,[arr|func]*/) {
    var i, length, arg = arguments;
    if (_.isArrayLike(arg[1])) {
        //set new data to array like Object
        length = obj.length = arg[1].length;
        if (length) {
            for (i = 0; i < length; i++) {
                obj[i] = arg[1][i];
            }
        }
        return obj;
    } else if (_.isFunction(arg[1])) {
        //traversing and get element of an array like Object
        length = obj.length;
        for (i = 0; i < length; i++) {
            arg[1](obj[i]);
        }
    } else {
        throw new TypeError('<%= pkg.name %>.Element(), internal Error!');
    }
};
var getElementsByClassName = function (classname, context) {
    var ret = [], elements, i, length;
    if (document.getElementsByClassName) {
        return context.getElementsByClassName(classname);
    } else {
        elements = context.getElementsByTagName('*');
        for (i = 0, length = elements.length; i < length; i++) {
            if (elements[i].className.indexOf(classname) > -1) {
                ret.push(elements[i]);
            }
        }
        return ret;
    }
};
Selector = function (selector, context) {
    var self = this, query, match, doc = document, elem, context, ret = [], noId,
        quickExpr = new RegExp('(?:' + regExp['ID'] + '$|^' + regExp['Element'] + '$|^' + regExp['Name'] + '$|^' + regExp['Class'] + '$)'),
        rightExpr = new RegExp('(?:' + regExp['Combinators'] + '|' + regExp['Descendant'] + ')' + '([\\S]+)$');
    if (typeof selector != 'string') {
        throw new TypeError();
    }
    self.selector = selector;
    self.context = context;
    //set context
    context = typeof arguments[1] == 'string' ? self.selector(arguments[1]) : arguments[1];
    if (!context || !_.isDocument(context) || !_.isElementNode(context)) {
        context = doc;
    }
    match = quickExpr.exec(selector);
    //fast query for ID, Element, Name and Class selector
    if (!!match) {
        if (!!match[1]) {
            elem = context.getElementById(match[1]);
            if (elem) {
                ret.push(elem);
            }
        } else if (!!match[2]) {
            ret = context.getElementsByTagName(match[2]);
        } else if (!!match[3]) {
            ret = context.getElementsByName(match[3]);
        } else if (!!match[4]) {
            ret = getElementsByClassName(match[4], context);
        }
        return accessArrayLike(self, ret);
    }
    //querySelectorAll
    if (doc.querySelectorAll) {
        if (self.isElementNode(context)) {
            noId = !context.id;
            if (noId) {
                context.id = 'querySelectorAllFix_' + Date.now();
            }
            ret = doc.querySelectorAll('#' + context.id + ' ' + selector);
            if (noId) {
                context.id = '';
            }
        } else {
            ret = doc.querySelectorAll(selector);
        }
        return accessArrayLike(self, ret);
    }

};
Selector.prototype = prototype;