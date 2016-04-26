'use strict';

var Tracker = require('./tracker');

module.exports = {
    createTracker: createTracker
};

/**
 * @param  {String}  id
 * @param  {Object}  [plugins] List of additional plugins available to {Tracker}
 * @param  {Object}  [config] Configuration object expected by {Tracker} instance
 * @return {Tracker}
 */
function createTracker(id, plugins, config) {
    config = config || {};
    plugins = plugins || {};

    return new Tracker(id, plugins).configure(config);
}
