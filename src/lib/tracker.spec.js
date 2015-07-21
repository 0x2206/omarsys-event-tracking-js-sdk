describe('Tracker', function () {
    'use strict';

    var assert = require('assert');
    var axios = require('axios');

    var Tracker = require('./tracker');
    var trackerInstance;

    beforeEach(function () {
        trackerInstance = new Tracker('t1');
    });

    /**
     * @description
     * Fake success web services response
     *
     * @todo
     * Once it's possible use https://github.com/mzabriskie/axios/issues/40
     *
     * @param  {*} data Response payload
     * @return {Promise}
     */
    function fakeResponse(data) {
        axios.interceptors.response.use(function ok(response) {
            return response;
        }, function error(response) {
            // As we're calling non existing server axios rejects promise
            // so we need to resolve it with fake positive response.
            response.data = data || null;
            response.status = 200;
            response.statusText = 'OK';
            response.headers['content-length'] = 0;
            response.headers['content-type'] = 'application/json';

            return Promise.resolve(response);
        });
    }

    describe('constructor', function () {
        it('should throw when empty string passed for `id`', function () {
            /* eslint-disable no-new */
            assert.throws(function () { new Tracker(' \t \n '); });
            assert.throws(function () { new Tracker(''); });
            /* eslint-enable no-new*/
        });

        it('should throw when non string passed for `id`', function () {
            /* eslint-disable no-new */
            assert.throws(function () { new Tracker(); });
            assert.throws(function () { new Tracker(42); });
            assert.throws(function () { new Tracker([]); });
            assert.throws(function () { new Tracker([1, 2, 3]); });
            assert.throws(function () { new Tracker({}); });
            assert.throws(function () { new Tracker({a: 1, b: 2}); });
            /* eslint-enable no-new */
        });

        it('should not throw when non empty string passed for `id`', function () {
            /* eslint-disable no-new */
            assert.doesNotThrow(function () { new Tracker('id'); });
            /* eslint-enable no-new */
        });

        it('should trim passed id', function () {
            var t = new Tracker(' \n \t t1 \t \n ');
            assert.strictEqual(t.id, 't1');
        });
    });

    describe('#track()', function () {
        it('should throw when empty or non string event name is passed', function () {
            assert.throws(function () { trackerInstance.track(); });
            assert.throws(function () { trackerInstance.track(' \n '); });
            assert.throws(function () { trackerInstance.track([]); });
            assert.throws(function () { trackerInstance.track({}); });
            assert.throws(function () { trackerInstance.track(0); });
            assert.throws(function () { trackerInstance.track(function () {}); });
            assert.doesNotThrow(function () { trackerInstance.track('e1'); });
        });

        it('should send XHR as GET', function (done) {
            fakeResponse();

            trackerInstance
                .track('e1')
                .then(function ok(response) {
                    assert.strictEqual(response.config.method, 'get');
                    assert.notStrictEqual(response.config.method, 'post');
                    assert.notStrictEqual(response.config.method, 'put');
                    assert.notStrictEqual(response.config.method, 'patch');
                    assert.notStrictEqual(response.config.method, 'delete');
                    done();
                })
                .catch(done);
        });

        it('should prefix payload property key event with `uv_` and does not include original one', function (done) {
            fakeResponse();

            trackerInstance
                .track('e1', {ev1: 'val1'})
                .then(function ok(response) {
                    assert.strictEqual(response.config.params.ev_ev1, 'val1');
                    assert.strictEqual(response.config.params.hasOwnProperty('ev1'), false);
                    done();
                })
                .catch(done);

        });

        it('should throw when payload is defined but not a plain object', function () {
            assert.throws(function () { trackerInstance.track('e1', true); });
            assert.throws(function () { trackerInstance.track('e1', false); });
            assert.throws(function () { trackerInstance.track('e1', null); });
            assert.throws(function () { trackerInstance.track('e1', 0); });
            assert.throws(function () { trackerInstance.track('e1', 42); });
            assert.throws(function () { trackerInstance.track('e1', -42); });
            assert.throws(function () { trackerInstance.track('e1', 42.42); });
            assert.throws(function () { trackerInstance.track('e1', -42.42); });
            assert.throws(function () { trackerInstance.track('e1', Infinity); });
            assert.throws(function () { trackerInstance.track('e1', []); });
            assert.throws(function () { trackerInstance.track('e1', [1, 2, 3]); });
            assert.doesNotThrow(function () { trackerInstance.track('e1', {a: 'a1'}); });
        });

        it('should always include `domain` parameter when making XHR call', function (done) {
            fakeResponse();

            trackerInstance
                .track('e1')
                .then(function (response) {
                    assert.notStrictEqual(response.config.params.host, undefined);
                    done();
                })
                .catch(done);
        });

        it('should always inclue `cookie` parameter when making XHR call', function (done) {
            fakeResponse();

            trackerInstance
                .track('e1')
                .then(function (response) {
                    assert.notStrictEqual(response.config.params.cookie, undefined);
                    done();
                })
                .catch(done);
        });
    });
});
