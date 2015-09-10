/**
 * @description
 * Snippet that allows to load tracking library asynchronously in web browser.
 *
 * To instantiate trackers pass their IDs to IIFE.
 *
 * It does the following:
 *     1. Creates TrackerStub instances and attaches those to `window`.
 *     2. Queues all function invocations made on TrackerStub instances
 *        along with all passed parameters.
 *     3. Injects tracking library asynchronously.
 *
 * @param {String[]}  trackers     Collection of strings representing trackers' unique identifiers
 * @param {String}    cdnUrl       URL used to load full tracking lib
 * @param {String}    endpointUrl  API endpoint used by all trackers
 */
(function (trackers, cdnUrl, endpointUrl) {
    'use strict';

    trackers = trackers || [];

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
    trackers.forEach(function (trackerName) {
        win[trackerName] = new TrackerStub(trackerName).configure({ apiEndpoint: endpointUrl });
    });

    // Async load tracking library
    script.async = 1;
    script.src = cdnUrl;
    doc.getElementsByTagName('head')[0].appendChild(script);
}(/* ['trackerId'], '//tracking.example.com/tracking.min.js', '//tracking.example.com' */));
