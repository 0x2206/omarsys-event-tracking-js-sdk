(function () {
    'use strict';

    var sdk = {};

    sdk.config = function (conf) {
        console.log('config', conf);
    };
    sdk.pageView = function () {
        console.log('page view');
    };
    sdk.track = function (eventName, properties) {
        console.log('track', eventName, properties);
    };
    sdk.identify = function (uid, properties) {
        console.log('identify', uid, properties);
    };

    module.exports = sdk;
}());
