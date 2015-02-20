var Contexts = {};

var contextFiles = [];

Contexts.init = function() {
    if (arguments.length > 0) {
        if (arguments[0] instanceof Array) {
            for (var i in arguments[0]) {
                contextFiles.push(arguments[0][i]);
            }
        } else {
            contextFiles.push(arguments[0]);
        }
    } else {
        throw 'Template Contexts not provided';
    }
}

Contexts.add = function(file) {
    contextFiles.push(file);
}

Contexts.remove = function(file) {
    var index = contextFiles.indexOf(file)
    contextFiles.splice(index, 1);
}

Contexts.RequestContext = function(req, params) {
    var data = {};
    for (var i in contextFiles) {
        var c = require(contextFiles[i])(req) || {};
        for (var j in c) {
            data[j] = c[j];
        }
    }
    for (var i in params) {
        data[i] = params[i];
    }
    return data;
}

module.exports = Contexts;
