(function () {
    'use strict';

    var Tracker = require('./tracker');

    module.exports = {
        createTracker: createTracker
    };

    /**
     * @param  {String}  id
     * @param  {Object}  [config] Configuration object expected by {Tracker} instance
     * @return {Tracker}
     */
    function createTracker(id, config) {
        config = config || {};
        return new Tracker(id).configure(config);
    }
}());
