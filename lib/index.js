var express = require('express'),
    _ = require('underscore'),
    path = require('path');

global.include = function() {
    var args = [];
    for (var i in arguments) {
        args.push(arguments[i]);
    }
    args = args.join(path.sep);
    return require(path.join(global.basepath, args));
};

var init = function(options) {
    global.basepath = options.basepath || __dirname;
    var app = (options.express || express)();

    var load = function(resourceUri, controller) {
        var verbs = {
            'read': 'get',
            'create': 'post',
            'update': 'put',
            'destroy': 'delete'
        };
        for (var handler in verbs) {
            var method = verbs[handler];
            if (controller[handler]) {
                app[method](resourceUri, _.bind(controller["pre" + handler], controller));
            }
        }
    };

    var addListener = function(evt, fn) {
        evt = evt.split(' ');
        var method = evt[0];
        var uri = evt[1];
        if (method == 'all') {
            load(uri, fn);
        } else {
            app[method](uri, fn);
        }
    };

    app.on = function() {
        var data = arguments[0];
        var fn = arguments[1] || null;
        if (fn) {
            addListener(data, fn);
        } else {
            for(var i in data) {
                addListener(i, data[i]);
            }
        }
    };

    return app;
};

module.exports = {
    init: init,
    Operation: require(['.', 'operation.js'].join(path.sep)),
    contexts: require(['.', 'contexts.js'].join(path.sep))
};
