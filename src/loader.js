/**
 * @description
 * Snippet that allows to load tracking library asynchronously in web browser.
 *
 * To instantiate trackers pass their IDs to IIFE.
 *
 * It does the following:
 *     1. Creates TrackerStub instances and attaches those to `window`.
 *     2. Queues all function invocations made on TrackeStub instances
 *        along with all passed parameters.
 *     3. Injects tracking library asynchronously.
 */
(function () {
    'use strict';

    var win = window,
        doc = document,
        script = doc.createElement('script'),
        slice = Array.prototype.slice,
        handle = '__ctet';

    win[handle] = {
        queue: []
    };

    /**
     * @constructor
     * @param {String} id
     */
    function TrackerStub(id) {
        var self = this;
        var trackerApi = ['configure', 'identify', 'track', 'trackPageView'];

        self.id = id;

        // Add stubbed Tracker API functions
        trackerApi.forEach(function (fname) {
            self[fname] = function () {
                win[handle].queue.push({
                    id: id,
                    action: {
                        fname: fname,
                        args: slice.call(arguments)
                    }
                });

                return this;
            };
        });
    }

    // Add TrackerStub instances to global window object
    slice.call(arguments).forEach(function (trackerName) {
        win[trackerName] = new TrackerStub(trackerName);
    });

    // Async load tracking library
    script.async = 1;
    script.src = '//localhost/tracking.min.js';
    doc.getElementsByTagName('head')[0].appendChild(script);
}(/* 'tracker1', 'tracker2', ... */));
