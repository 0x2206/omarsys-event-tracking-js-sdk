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
        this.identity = null;
        this.uid = null;

        // Create tracking cookie
        if (!cookieExists(this.config.cookieName)) {
            cookie.set(this.config.cookieName, uuid.v4(), {
                expires: new Date(4242, 12, 30, 23, 59, 59).toUTCString()
            });
        }
    }

    Tracker.prototype.configure = configure;
    Tracker.prototype.identify = identify;
    Tracker.prototype.track = track;

    /**
     * @param  {Object}  options
     * @return {Tracker}
     */
    function configure(options) {
        this.config = util.merge([
            this.config,
            util.whitelist(options, ['apiEndpoint', 'cookieName', 'domain'])
        ]);

        return this;
    }

    /**
     * @param  {String}  uid
     * @param  {Object}  identificationPayload
     * @return {Tracker}
     */
    function identify(uid, identificationPayload) {
        if (!util.isString(uid)) {
            throw new TypeError('`uid` has to be a string');
        }

        if (util.isEmpty(uid)) {
            throw new TypeError('`uid` cannot be empty');
        }

        if (util.isDefined(identificationPayload) && !util.isPlainObject(identificationPayload)) {
            throw new TypeError('`identificationPayload` has to be a plain object');
        }

        this.uid = uid.trim();

        if (util.isDefined(identificationPayload)) {
            // When merging for the first time convert to empty object
            this.identity = this.identity || {};
            this.identity = util.merge([this.identity, identificationPayload]);
        }

        return this;
    }

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
            mapEventPayload(eventPayload),
            mapIdentificationPayload(this.identity)
        ]);

        if (this.uid) {
            xhrPayload = util.merge([xhrPayload, {uid: this.uid}]);
        }

        return http({
            method: 'get',
            url: this.config.apiEndpoint,
            params: xhrPayload
        });
    }

    function mapEventPayload(payload) {
        return mapPayload(payload, 'ev_');
    }

    function mapIdentificationPayload(payload) {
        return mapPayload(payload, 'ur_');
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
