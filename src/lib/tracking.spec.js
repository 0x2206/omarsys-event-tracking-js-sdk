'use strict';

describe('Tracking', function () {
    var assert = require('assert');

    var Tracking = require('./tracking');
    var Tracker = require('./tracker');

    describe('#createTracker()', function () {
        it('creates new tracker instance', function () {
            var t = Tracking.createTracker('id');
            assert.strictEqual((t instanceof Tracker), true);
        });
    });
});
