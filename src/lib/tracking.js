(function () {
    'use strict';

    var Tracker = require('./tracker');

    module.exports = {
        createTracker: createTracker
    };

    /**
     * @param  {String}  id
     * @return {Tracker}
     */
    function createTracker(id) {
        return new Tracker(id);
    }
}());
