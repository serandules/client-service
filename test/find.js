var log = require('logger')('service-clients:test:find');
var should = require('should');
var request = require('request');
var pot = require('pot');
var mongoose = require('mongoose');
var errors = require('errors');

describe('GET /clients', function () {
    var client;
    before(function (done) {
        pot.client(function (err, c) {
            if (err) {
                return done(err);
            }
            client = c;
            done();
        });
    });

    it('GET /clients/:id unauthorized', function (done) {
        request({
            uri: pot.resolve('accounts', '/apis/v/clients/' + client.serandivesId),
            method: 'GET',
            json: true
        }, function (e, r, b) {
            if (e) {
                return done(e);
            }
            r.statusCode.should.equal(errors.unauthorized().status);
            should.exist(b);
            should.exist(b.code);
            should.exist(b.message);
            b.code.should.equal(errors.unauthorized().data.code);
            done();
        });
    });

    it('GET /clients/:id', function (done) {
        request({
            uri: pot.resolve('accounts', '/apis/v/clients/' + client.serandivesId),
            method: 'GET',
            auth: {
                bearer: client.users[0].token
            },
            json: true
        }, function (e, r, b) {
            if (e) {
                return done(e);
            }
            r.statusCode.should.equal(200);
            should.exist(b);
            should.exist(b.id);
            should.exist(b.name);
            b.id.should.equal(client.serandivesId);
            b.name.should.equal('serandives');
            done();
        });
    });
});