(function () {
    'use strict';

    var Tracker = require('./tracker');

    module.exports = {
        createTracker: createTracker
    };

    function createTracker(id) {
        return new Tracker(id);
    }
}());
