var path = require('path'),
    _ = require('underscore');

var pageNotFound = require(['.', 'pagenotfound'].join(path.sep));

module.exports = {
    settings: {
        loginRequired: false,
        logoutRequired: false
    },
    parseData: function(req, res, next) {
        next(req, res);
    },
    dumpUser: function(req, res, next) {
        next(req, res);
    },
    verifySession: function(req, res, next) {
        next(req, res);
    },
    preread: function(request, response) {
        var _this = this;
        response['pageNotFound'] = pageNotFound;
        if (_this['read']) {
            request['args'] = request.query;
            _this.parseData(request, response, function() {
                _this.verifySession(request, response, function() {
                    _this.dumpUser(request, response, function() {
                        _this['read'](request, response);
                    });
                });
            });
        }
    },
    precreate: function(request, response) {
        var _this = this;
        response['pageNotFound'] = pageNotFound;
        if (_this['create']) {
            request['args'] = request.body;
            if ('model' in request.body) {
                request['args'] = JSON.parse(request.body.model);
            }
            _this.parseData(request, response, function() {
                _this.verifySession(request, response, function() {
                    _this.dumpUser(request, response, function() {
                        _this['create'](request, response);
                    });
                });
            });
        }
    },
    preupdate: function(request, response) {
        var _this = this;
        response['pageNotFound'] = pageNotFound;
        if (_this['update']) {
            request['args'] = request.body;
            if ('model' in request.body) {
                request['args'] = JSON.parse(request.body.model);
            }
            _this.parseData(request, response, function() {
                _this.verifySession(request, response, function() {
                    _this.dumpUser(request, response, function() {
                        _this['update'](request, response);
                    });
                });
            });
        }
    },
    predestroy: function(request, response) {
        var _this = this;
        response['pageNotFound'] = pageNotFound;
        if (_this['destroy']) {
            request['args'] = request.query;
            _this.parseData(request, response, function() {
                _this.verifySession(request, response, function() {
                    _this.dumpUser(request, response, function() {
                        _this['destroy'](request, response);
                    });
                });
            });
        }
    },
    extend: function(object, args) {
        var _this = _.extend(object, this);
        if (args != undefined) {
            _this['settings'] = {
                loginRequired: args.loginRequired || false,
                logoutRequired: args.logoutRequired || false
            }
        }
        return _this;
    }
};
