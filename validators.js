var validators = require('validators');
var Clients = require('model-clients');

exports.create = function (req, res, next) {
    validators.create({
        content: 'json',
        model: Clients
    }, req, res, next);
};