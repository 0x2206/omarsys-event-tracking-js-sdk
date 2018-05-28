'use strict';

describe('Tracking', function () {
    var assert = require('assert');

    var Tracking = require('./tracking');
    var Tracker = require('./tracker');

    describe('#createTracker()', function () {
        it('should create new Tracker instance', function () {
            var t = Tracking.createTracker('id');
            assert.strictEqual((t instanceof Tracker), true);
        });
    });

    describe('#get/setPlugins()', function () {
        it('should get/set plugins', function () {
            var plugins = {};
            Tracking.setPlugins(plugins);
            var result = Tracking.getPlugins();
            assert.equal(result, plugins);
        });
    });
});
