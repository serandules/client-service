var log = require('logger')('client-service');
var utils = require('utils');
var Client = require('client');
var mongoose = require('mongoose');
var Token = require('token');
var mongutils = require('mongutils');
var sanitizer = require('./sanitizer');

var express = require('express');
var router = express.Router();

module.exports = router;

var paging = {
    start: 0,
    count: 10,
    sort: ''
};

var fields = {
    '*': true
};

/**
 * {"name": "serandives app"}
 */
router.post('/clients', function (req, res) {
    var data = req.body;
    data.user = '522cb77187313c454a000001';
    Client.create(req.body, function (err, client) {
        if (err) {
            console.error(err);
            res.status(500).send({
                error: true
            });
            return;
        }
        res.send(client);
    });
});

router.get('/clients/:id', function (req, res) {
    if (!mongutils.objectId(req.params.id)) {
        res.status(404).send({
            error: 'specified client cannot be found'
        });
        return;
    }
    Client.findOne({
        _id: req.params.id
    })
        .exec(function (err, client) {
            if (err) {
                console.error('client find error');
                res.status(500).send({
                    error: true
                });
                return;
            }
            if (!client) {
                res.status(404).send({
                    error: true
                });
                return;
            }
            res.send(client);
        });
});


/**
 * /users?data={}
 */
router.get('/clients', function (req, res) {
    var data = req.query.data ? JSON.parse(req.query.data) : {};
    sanitizer.clean(data.criteria || (data.criteria = {}));
    utils.merge(data.paging || (data.paging = {}), paging);
    utils.merge(data.fields || (data.fields = {}), fields);
    Client.find(data.criteria)
        .skip(data.paging.start)
        .limit(data.paging.count)
        .sort(data.paging.sort)
        .exec(function (err, clients) {
            if (err) {
                //TODO: send proper HTTP code
                console.error('client find error');
                res.status(500).send({
                    error: true
                });
                return;
            }
            res.send(clients);
        });
});

router.delete('/clients/:id', function (req, res) {
    if (!mongutils.objectId(req.params.id)) {
        res.status(404).send({
            error: 'specified client cannot be found'
        });
        return;
    }
    Client.findOne({
        _id: req.params.id
    })
        .exec(function (err, client) {
            if (err) {
                console.error('client find error');
                res.status(500).send({
                    error: 'error while retrieving client'
                });
                return;
            }
            if (!client) {
                res.status(404).send({
                    error: 'specified client cannot be found'
                });
                return;
            }
            client.remove();
            res.send({
                error: false
            });
        });
});

