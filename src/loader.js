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
(function (trackers, cdnUrl, endpointUrl, pluginUrls) {
    'use strict';

    var win = window,
        doc = document,
        slice = Array.prototype.slice,
        handle = '__ctet';

    (function init() {
        trackers = trackers || [];
        pluginUrls = pluginUrls || [];

        win[handle] = {
            queue: [],
            librariesLoaded: 0,
            librariesTotal: 1 + pluginUrls.length,
            libraryLoadedCallback: libraryLoadedCallback,
            plugins: {}
        };

        // Add TrackerStub instances to global window object
        trackers.forEach(function (trackerName) {
            win[trackerName] = new TrackerStub(trackerName).configure({ apiEndpoint: endpointUrl });
        });

        [cdnUrl]
            .concat(pluginUrls)
            .forEach(loadLibrary);
    })();

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

    /**
     * Callback
     * Marks library as loaded
     */
    function libraryLoadedCallback() {
        win[handle].librariesLoaded++;
    }

    /**
     * Loads external JS script.
     *
     * @param {String} url
     */
    function loadLibrary(url) {
        var script = doc.createElement('script');
        // Async load tracking library
        script.async = 1;
        script.src = url;
        doc.getElementsByTagName('head')[0].appendChild(script);

        if (undefined !== script.onreadystatechange) {
            script.onreadystatechange = function () {
                if (4 === this.readyState || 'complete' === this.readyState || 'loaded' === this.readyState) {
                    win[handle].libraryLoadedCallback();
                    removeScript();
                }
            };
        } else {
            script.onload = function (e) {
                win[handle].libraryLoadedCallback();
                removeScript();
            };

            script.onerror = removeScript;
        }

        function removeScript() {
            if (script && script.parentNode) {
                script.parentNode.removeChild(script);
                script = null;
            }
        }
    }
}(/* ['trackerId'], '//tracking.example.com/tracking.min.js', '//tracking.example.com' */));
