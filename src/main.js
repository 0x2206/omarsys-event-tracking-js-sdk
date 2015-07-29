(function () {
    'use strict';

    var Tracker = require('./lib/tracker.js');

    // Browserify exposes `window` as `global`
    global.CherryTechEventTracking = module.exports = require('./lib/tracking.js');

    handleQueuedEvents();

    /**
     * Handles queued events when including tracking lib asynchronously but invoking
     * tracker's functions before it is loaded.
     *
     * It processes `queue` property of global object `__ctet` by replacing
     * all stubs with Tracker instance and applying all queued function invocations
     * along with all parameters passed previously.
     *
     * Queue is an array of well defined objects, like:
     *
     * var queuedItem = {
     *     id: 'tracker1',
     *     action: {
     *         fname: 'track',
     *         args: ['button_clicked', { type: 'register', page: 'login_overlay' }]
     *     }
     * };
     *
     * where:
     *     - `id` is unique identifier of Tracker that will be instantiated
     *       and attached to `window`
     *     - `action.fname` is a name of one of functions exposed by Tracker API
     *     - `action.args` is array of arguments passed to that function
     */
    function handleQueuedEvents() {
        if (global.__ctet) { // eslint-disable-line no-underscore-dangle
            global.__ctet.queue.forEach(function (trackerStub) { // eslint-disable-line no-underscore-dangle
                var tracker = global[trackerStub.id];

                if (!(tracker instanceof Tracker)) {
                    global[trackerStub.id] = tracker = new Tracker(trackerStub.id);
                }

                tracker[trackerStub.action.fname].apply(tracker, trackerStub.action.args);
            });
        }
    }
}());
