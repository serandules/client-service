var errors = require('errors');
var validators = require('validators');

exports.create = function (req, res, next) {
    validators.json(req, res, function (err) {
        if (err) {
            return next(err);
        }
        var i;
        var url;
        var data = req.body;
        var name = data.name;
        if (!name) {
            return res.pond(errors.unprocessableEntiy('\'name\' needs to be specified'));
        }
        var to = data.to;
        if (to) {
            if (!Array.isArray(to)) {
                return res.pond(errors.unprocessableEntiy('\'to\' needs to be an array'));
            }
            if (to.length > 5) {
                return res.pond(errors.unprocessableEntiy('\'to\' contains an invalid number of values'));
            }
            for (i = 0; i < to.length; i++) {
                url = to[i];
                if (!url || url.length > 2000 || (url.indexOf('http://') === -1 && url.indexOf('https://') === -1)) {
                    return res.pond(errors.unprocessableEntiy('\'to\' contains an invalid value'));
                }
            }
        }
        next();
    });
};