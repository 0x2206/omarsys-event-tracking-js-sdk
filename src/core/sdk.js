/* global define */
/* eslint-env browser */
define(function () {
    'use strict';

    var sdk = {};

    sdk.config = function (conf) {
        console.log('config', conf); // eslint-disable-line no-console
    };
    sdk.pageView = function () {
        console.log('page view'); // eslint-disable-line no-console
    };
    sdk.track = function (eventName, properties) {
        console.log('track', eventName, properties); // eslint-disable-line no-console
    };
    sdk.identify = function (uid, properties) {
        console.log('identify', uid, properties); // eslint-disable-line no-console
    };

    return sdk;
});
