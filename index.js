var log = require('logger')('service-clients');
var express = require('express');
var bodyParser = require('body-parser');

var errors = require('errors');
var utils = require('utils');
var mongutils = require('mongutils');
var auth = require('auth');
var throttle = require('throttle');
var serandi = require('serandi');
var Clients = require('model-clients');

var validators = require('./validators');
var sanitizers = require('./sanitizers');

module.exports = function (router, done) {
    router.use(serandi.ctx);
    router.use(auth());
    router.use(throttle.apis('clients'));
    router.use(bodyParser.json());

    router.post('/', validators.create, sanitizers.create, function (req, res, next) {
      Clients.create(req.body, function (err, client) {
        if (err) {
          return next(err);
        }
        res.locate(client.id).status(201).send(client);
      });
    });

    router.get('/:id', validators.findOne, sanitizers.findOne, function (req, res, next) {
      mongutils.findOne(Clients, req.query, function (err, client) {
        if (err) {
          return next(err);
        }
        res.send(client);
      });
    });

    router.delete('/:id', validators.findOne, sanitizers.findOne, function (req, res, next) {
      mongutils.remove(Clients, req.query, function (err) {
        if (err) {
          return next(err);
        }
        res.status(204).end();
      });
    });

    done();
};