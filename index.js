var log = require('logger')('service-clients');
var bodyParser = require('body-parser');

var auth = require('auth');
var throttle = require('throttle');
var serandi = require('serandi');
var model = require('model');
var Clients = require('model-clients');

module.exports = function (router, done) {
    router.use(serandi.ctx);
    router.use(auth({
      GET: [
        '^\/$',
        '^\/.*'
      ]
    }));
    router.use(throttle.apis('clients'));
    router.use(bodyParser.json());

    router.post('/',
      serandi.json,
      serandi.create(Clients),
      function (req, res, next) {
      model.create(req.ctx, function (err, client) {
        if (err) {
          return next(err);
        }
        res.locate(client.id).status(201).send(client);
      });
    });

    router.post('/:id',
      serandi.json,
      serandi.transit({
        workflow: 'model-clients',
        model: Clients
    }));

    router.get('/:id',
      serandi.findOne(Clients),
      function (req, res, next) {
      model.findOne(req.ctx, function (err, client) {
        if (err) {
          return next(err);
        }
        res.send(client);
      });
    });

    router.put('/:id',
      serandi.json,
      serandi.update(Clients),
      function (req, res, next) {
        model.update(req.ctx, function (err, client) {
          if (err) {
            return next(err);
          }
          res.locate(client.id).status(200).send(client);
        });
    });

    router.delete('/:id',
      serandi.remove(Clients),
      function (req, res, next) {
      model.remove(req.ctx, function (err) {
        if (err) {
          return next(err);
        }
        res.status(204).end();
      });
    });

    done();
};
