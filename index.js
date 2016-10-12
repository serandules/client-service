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
    Client.create(req.body, function (err, client) {
        if (err) {
            log.error(err);
            res.status(500).send([{
                code: 500,
                message: 'Internal Server Error'
            }]);
            return;
        }
        res.send(client);
    });
});

router.get('/clients/:id', function (req, res) {
    if (!mongutils.objectId(req.params.id)) {
        res.status(401).send([{
            code: 401,
            message: 'Unauthorized'
        }]);
        return;
    }
    Client.findOne({
        _id: req.params.id
    })
        .exec(function (err, client) {
            if (err) {
                log.error(err);
                res.status(500).send([{
                    code: 500,
                    message: 'Internal Server Error'
                }]);
                return;
            }
            if (!client) {
                res.status(401).send([{
                    code: 401,
                    message: 'Unauthorized'
                }]);
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
                log.error(err);
                res.status(500).send([{
                    code: 500,
                    message: 'Internal Server Error'
                }]);
                return;
            }
            res.send(clients);
        });
});

router.delete('/clients/:id', function (req, res) {
    if (!mongutils.objectId(req.params.id)) {
        res.status(401).send([{
            code: 401,
            message: 'Unauthorized'
        }]);
        return;
    }
    Client.findOne({
        _id: req.params.id
    })
        .exec(function (err, client) {
            if (err) {
                log.error(err);
                res.status(500).send([{
                    code: 500,
                    message: 'Internal Server Error'
                }]);
                return;
            }
            if (!client) {
                res.status(401).send([{
                    code: 401,
                    message: 'Unauthorized'
                }]);
                return;
            }
            client.remove();
            res.status(204).end();
        });
});

