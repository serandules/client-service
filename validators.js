var validators = require('validators');
var Clients = require('model-clients');

exports.create = function (req, res, next) {
    validators.create({
        model: Clients
    }, req, res, next);
};