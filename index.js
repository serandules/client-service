var log = require('logger')('service-clients');
var express = require('express');
var bodyParser = require('body-parser');

var utils = require('utils');
var mongutils = require('mongutils');
var auth = require('auth');
var serandi = require('serandi');
var Client = require('model-clients');

var validators = require('./validators');
var sanitizers = require('./sanitizers');

var paging = {
    start: 0,
    count: 10,
    sort: ''
};

var fields = {
    '*': true
};

module.exports = function (router) {
    router.use(serandi.pond);
    router.use(serandi.ctx);
    router.use(auth({}));
    router.use(bodyParser.json());

    /**
     * {"name": "serandives app"}
     */
    router.post('/', validators.create, sanitizers.create, function (req, res) {
        Client.create(req.body, function (err, client) {
            if (err) {
                log.error(err);
                return res.pond(errors.serverError());
            }
            res.locate(client.id).status(201).send(client);
        });
    });

    router.get('/:id', function (req, res) {
        if (!mongutils.objectId(req.params.id)) {
            return res.pond(errors.unauthorized());
        }
        Client.findOne({
            _id: req.params.id
        }).exec(function (err, client) {
            if (err) {
                log.error(err);
                return res.pond(errors.serverError());
            }
            if (!client) {
                return res.pond(errors.unauthorized());
            }
            res.send(client);
        });
    });


    /**
     * /users?data={}
     */
    router.get('/', function (req, res) {
        var data = req.query.data ? JSON.parse(req.query.data) : {};
        sanitizers.clean(data.query || (data.query = {}));
        utils.merge(data.paging || (data.paging = {}), paging);
        utils.merge(data.fields || (data.fields = {}), fields);
        Client.find(data.query)
            .skip(data.paging.start)
            .limit(data.paging.count)
            .sort(data.paging.sort)
            .exec(function (err, clients) {
                if (err) {
                    log.error(err);
                    return res.pond(errors.serverError());
                }
                res.send(clients);
            });
    });

    router.delete('/:id', function (req, res) {
        if (!mongutils.objectId(req.params.id)) {
            return res.pond(errors.unauthorized());
        }
        Client.findOne({
            _id: req.params.id
        }).exec(function (err, client) {
            if (err) {
                log.error(err);
                return res.pond(errors.serverError());
            }
            if (!client) {
                return res.pond(errors.unauthorized());
            }
            client.remove();
            res.status(204).end();
        });
    });

};