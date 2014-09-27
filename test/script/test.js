/**
 * Created by elvisz on 2014/8/21.
 */
var _indexOf = function (arr, query) {
    var i, l, idx = -1;
    if (Array.prototype.indexOf) {
        idx = arr.indexOf(query);
    } else {
        for (i = 0, l = arr.length; i < l; i++) {
            if (arr[i] === query) {
                idx = i;
                break;
            }
        }
    }
    return idx;
};
var thousands = function (num) {
    var thousands = (num + '').split('.'), integer = thousands[0], fractional = thousands[1];
    thousands = [];
    while (integer.length > 0) {
        thousands.unshift(integer.substring(integer.length - 3));
        integer = integer.substring(0, integer.length - 3);
    }
    return thousands.join(',') + (typeof fractional == 'string' ? fractional : '');
}
var spend = function (times, fn, context, args) {
    var t, i, l = times || 1, total = 0, func, steps, members, ret;
    if (typeof fn == 'string') {
        i = 0;
        members = fn.split('.');
        steps = members.length;
        while (i < steps) {
            func = i > 0 ? func[members[i]] : window[members[i]];
            if (context === null && i === steps - 2) {
                context = func;
            }
            i++;
        }
    }
    if (typeof fn == 'function') {
        func = fn;
    } else {
        return total;
    }
    if (typeof func == 'function') {
        i = 0;
        t = new Date().getTime();
        while (i < times) {
            ret = func.apply(context, Array.prototype.slice.call(arguments, 3));
//            if (!i) {
//                console.log(ret);
//            }
            i++;
        }
        total = new Date().getTime() - t;
    }
    return thousands(total);
};
var logger = function (method, times, cost) {
    return ['<tr>',
            '<td>' + method + '</td>',
            '<td>' + thousands(times) + '</td>',
            '<td>' + cost + '</td>',
        '</tr>'].join('');
};
var loggerGroup = function (group) {
    return '<tr><td colspan="3" class="group">' + group + '</td></tr>';
};
var runner = function (method, times, func, context, args) {
    return logger(method, times, spend.apply(context, [times, func, context].concat(Array.prototype.slice.call(arguments, 4))));
};
var compare = function (method, times, args) {
    var i, l, methods = [], costs = [], best, cost, bestIdx;
    for (i = 0, l = method.length; i < l; i++) {
        methods.push(method[i].name);
        cost = spend.apply(window, [times, method[i].func, method[i].context].concat(Array.prototype.slice.call(arguments, 2)));
        cost = Number(cost);
        costs.push(cost);
        if (best) {
            best = Math.min(best, cost);
        } else {
            best = cost;
        }
    }
    bestIdx = _indexOf(costs, best);
    methods[bestIdx] = '<span class="best">' + methods[bestIdx] + '</span>';
    costs[bestIdx] = '<span class="best">' + costs[bestIdx] + '</span>';
    return logger(methods.join('/'), times, costs.join('/'));
};
