(function () {
    'use strict';

    var http = require('axios');
    var cookie = require('cookie-cutter-shim');
    var uuid = require('node-uuid');
    var util = require('./util');

    module.exports = Tracker;

    var defaultConfig = {
        apiEndpoint: 'localhost',
        domain: util.getHost() || 'localhost',
        cookieName: 'ct_tracker'
    };

    /**
     * @constructor
     * @param {String} id
     *
     * @throws
     */
    function Tracker(id) {
        if (util.isString(id) && util.isEmpty(id)) {
            throw new TypeError('`id` cannot be an empty string');
        }

        if (!util.isString(id)) {
            throw new TypeError('`id` has to be a string');
        }

        this.id = id.trim();
        this.config = defaultConfig;

        // Create tracking cookie
        if (!cookieExists(this.config.cookieName)) {
            cookie.set(this.config.cookieName, uuid.v4(), {
                expires: new Date(4242, 12, 30, 23, 59, 59).toUTCString()
            });
        }
    }

    Tracker.prototype.track = track;

    /**
     * @param  {String}  eventName
     * @param  {Object}  [eventPayload]
     * @return {Promise}
     *
     * @throws
     */
    function track(eventName, eventPayload) {
        if (util.isEmpty(eventName)) {
            throw new TypeError('`eventName` cannot be empty');
        }

        if (!util.isString(eventName)) {
            throw new TypeError('`eventName` has be a string');
        }

        if (util.isDefined(eventPayload) && !util.isPlainObject(eventPayload)) {
            throw new TypeError('`eventPayload` has to be an object');
        }

        if (util.isDefined(eventPayload) && util.isPlainObject(eventPayload) && util.isEmpty(eventPayload)) {
            throw new TypeError('`eventPayload` cannot be an empty object');
        }

        var xhrPayload = util.merge([
            {
                host: this.config.domain,
                cookie: cookie.get(this.config.cookieName),
                event: eventName
            },
            mapEventPayload(eventPayload)
        ]);

        return http({
            method: 'get',
            url: this.config.apiEndpoint,
            params: xhrPayload
        });
    }

    function mapEventPayload(payload) {
        return mapPayload(payload, 'ev_');
    }

    /**
     * @param  {Object} payload
     * @param  {String} prefix
     * @return {Object}
     */
    function mapPayload(payload, prefix) {
        prefix = prefix || '';

        var out = {};

        for (var key in payload) {
            if (payload.hasOwnProperty(key)) {
                out[prefix + key] = payload[key];
            }
        }

        return out;
    }

    /**
     * @description
     * Checks if cookie with passed name exists.
     *
     * @param  {String}  cookieName
     * @return {Boolean}
     */
    function cookieExists(cookieName) {
        // That's not entirely true as cookie can have undefined value
        // but we treat it as non existent in that case.
        return cookie.get(cookieName) !== undefined ? true : false;
    }
}());
