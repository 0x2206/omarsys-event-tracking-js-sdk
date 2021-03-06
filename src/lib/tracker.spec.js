describe('Tracker', function () {
    'use strict';

    var assert = require('assert');
    var axiosmock = require('./axios-mock');

    var Tracker = require('./tracker');
    var trackerInstance;

    var square = function (number) {
        return number * number;
    };

    beforeEach(function () {
        trackerInstance = new Tracker('t1', { square: square });
        trackerInstance.configure({ apiEndpoint: '//test_api_endpoint' });
        trackerInstance.xhr = axiosmock.create();
    });

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

        it('should trim passed `id`', function () {
            var t = new Tracker(' \n \t t1 \t \n ');
            assert.strictEqual(t.id, 't1');
        });

        it('should have `identity` property that is empty object by default', function () {
            assert.strictEqual(trackerInstance.hasOwnProperty('identity'), true);
            assert.deepEqual(trackerInstance.identity, {});
        });

        it('should have `uid` property that is null by default', function () {
            assert.strictEqual(trackerInstance.hasOwnProperty('uid'), true);
            assert.strictEqual(trackerInstance.uid, null);
        });

        it('should have registered plugin', function () {
            assert.strictEqual(trackerInstance.plugins.hasOwnProperty('square'), true);
        });
    });

    describe('#configure()', function () {
        it('should merge passed params with current ones', function () {
            trackerInstance.configure({
                apiEndpoint: 'test_api_endpoint',
                domain: 'test_domain',
                cookieName: 'test_cookie_name',
                pageViewEventName: 'test_pv'
            });

            assert.deepEqual(trackerInstance.config, {
                apiEndpoint: 'test_api_endpoint',
                domain: 'test_domain',
                cookieName: 'test_cookie_name',
                pageViewEventName: 'test_pv'
            });
        });

        it('should set only whitelisted params', function () {
            trackerInstance.configure({
                apiEndpoint: 'test_api_endpoint',
                domain: 'test_domain',
                cookieName: 'test_cookie_name',
                notWhitelistedProperty: 'value',
                pageViewEventName: 'test_pv'
            });

            assert.strictEqual(trackerInstance.config.apiEndpoint, 'test_api_endpoint');
            assert.strictEqual(trackerInstance.config.domain, 'test_domain');
            assert.strictEqual(trackerInstance.config.cookieName, 'test_cookie_name');
            assert.strictEqual(trackerInstance.config.pageViewEventName, 'test_pv');
            assert.strictEqual(trackerInstance.config.hasOwnProperty('notWhitelistedProperty'), false);
        });

        it('should send overridden `domain` in subsequent requests once set', function (done) {
            trackerInstance
                .configure({
                    domain: 'test_domain'
                })
                .track('e1')
                .catch(done);

            trackerInstance
                .track('e2')
                .then(function (response) {
                    assert.strictEqual(response.config.params.host, 'test_domain');
                    done();
                })
                .catch(done);
        });


        it('should use overridden cookie name', function () {
            trackerInstance.configure({ cookieName: 'test_cookie' });
            assert.strictEqual(trackerInstance.config.cookieName, 'test_cookie');
        });

        it('should use overridden API endpoint', function (done) {
            trackerInstance
                .configure({ apiEndpoint: '//test_api_endpoint2' })
                .track('e1')
                .then(function (response) {
                    assert.strictEqual(response.config.url, '//test_api_endpoint2');
                    done();
                })
                .catch(done);
        });
    });

    describe('#identify()', function () {
        it('should exist and be a function', function () {
            assert.strictEqual((typeof trackerInstance.identify), 'function');
        });

        it('should return Tracker instance', function () {
            var t = new Tracker('id');
            assert.strictEqual(trackerInstance.identify('uid'), trackerInstance);
            assert.notStrictEqual(trackerInstance.identify('uid'), t);
        });

        it('should accept empty `uid`', function () {
            assert.doesNotThrow(function () { trackerInstance.identify(); });
            assert.doesNotThrow(function () { trackerInstance.identify(undefined); });
            assert.doesNotThrow(function () { trackerInstance.identify(null); });
            assert.doesNotThrow(function () { trackerInstance.identify(''); });
            assert.doesNotThrow(function () { trackerInstance.identify([]); });
            assert.doesNotThrow(function () { trackerInstance.identify({}); });
            assert.doesNotThrow(function () { trackerInstance.identify(' \t \n '); });
        });

        it('should throw on non string `uid`', function () {
            assert.throws(function () { trackerInstance.identify(true); });
            assert.throws(function () { trackerInstance.identify(false); });
            assert.throws(function () { trackerInstance.identify(0); });
            assert.throws(function () { trackerInstance.identify(42); });
            assert.throws(function () { trackerInstance.identify(/lol/); });
            assert.throws(function () { trackerInstance.identify(new Date()); });
        });

        it('should trim `uid`', function () {
            trackerInstance.identify(' \t \n uid \n \t ');
            assert.strictEqual(trackerInstance.uid, 'uid');
        });

        it('passing empty `uid` should reset internal `uid`', function () {
            assert.strictEqual(trackerInstance.uid, null);
            trackerInstance.identify('id');
            assert.strictEqual(trackerInstance.uid, 'id');
            trackerInstance.identify([]);
            assert.strictEqual(trackerInstance.uid, null);
        });

        it('should throw on `identificationPayload` being non plain object (if it is defined)', function () {
            assert.throws(function () { trackerInstance.identify('uid', false); });
            assert.throws(function () { trackerInstance.identify('uid', 42); });
            assert.throws(function () { trackerInstance.identify('uid', 'lol'); });
            assert.throws(function () { trackerInstance.identify('uid', /lol/); });
            assert.throws(function () { trackerInstance.identify('uid', new Date()); });
            assert.throws(function () { trackerInstance.identify('uid', [1, 2, 3]); });
            assert.doesNotThrow(function () { trackerInstance.identify('uid'); });
            assert.doesNotThrow(function () { trackerInstance.identify('uid', undefined); });
        });

        it('should merge passed user identity payload with current one', function () {
            trackerInstance
                .identify('uid', { email: 'm@m.mm', name: 'name' })
                .identify('uid', { email: 'm2@m.mm', user: 'user' });

            assert.deepEqual(trackerInstance.identity, {
                email: 'm2@m.mm',
                user: 'user',
                name: 'name'
            });
        });

        it('should include passed `uid` when making XHR call', function (done) {
            trackerInstance
                .identify('test_uid')
                .track('e1')
                .then(function (response) {
                    assert.strictEqual(response.config.params.uid, 'test_uid');
                    done();
                })
                .catch(done);
        });

        it('should skip `uid` when making XHR call with undefined `uid` passed beforehand', function (done) {
            trackerInstance
                .identify(null, {data: 'data'})
                .track('e1')
                .then(function ok(response) {
                    assert.strictEqual(response.config.params.hasOwnProperty('uid'), false);
                    done();
                })
                .catch(done);
        });

        it('should prefix identification payload property key with `ur_` and does not include original one', function (done) {
            trackerInstance
                .identify('test_uid', { mail: 'm@m.mm' })
                .track('e1')
                .then(function ok(response) {
                    assert.strictEqual(response.config.params.hasOwnProperty('ur_mail'), true);
                    assert.strictEqual(response.config.params.ur_mail, 'm@m.mm');
                    assert.strictEqual(response.config.params.hasOwnProperty('mail'), false);
                    done();
                })
                .catch(done);
        });

        it('should reset `Tracker#uid` to default when successful call made', function (done) {
            trackerInstance
                .identify('test_uid')
                .track('test_event')
                .then(function () {
                    assert.strictEqual(trackerInstance.uid, null);
                    done();
                })
                .catch(done);
        });

        it('should reset `Tracker#identity` to default when successful call made', function (done) {
            trackerInstance
                .identify('test_uid')
                .track('test_event')
                .then(function () {
                    assert.deepEqual(trackerInstance.identity, {});
                    done();
                })
                .catch(done);
        });

        it('should not send `uid` on subsequent requests', function (done) {
            trackerInstance
                .identify('test_uid')
                .track('test_event')
                .then(function () {
                    trackerInstance
                        .track('test_event2')
                        .then(function (response) {
                            assert.strictEqual(response.config.params.hasOwnProperty('uid'), false);
                            done();
                        })
                        .catch(done);
                })
                .catch(done);
        });

        it('should not send contents of `Tracker#identity` object on subsequent requests', function (done) {
            trackerInstance
                .identify('test_uid', { user: 'name' })
                .track('test_event')
                .then(function () {
                    trackerInstance
                        .track('test_event2')
                        .then(function (response) {
                            assert.strictEqual(response.config.params.hasOwnProperty('ur_user'), false);
                            done();
                        })
                        .catch(done);
                })
                .catch(done);
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

        it('should not throw when payload is an empty object', function () {
            assert.doesNotThrow(function () { trackerInstance.track('e1', {}); });
            assert.doesNotThrow(function () { trackerInstance.track('e1', Object.create(null)); });
        });

        it('should throw when API endpoint has not being configured while sending event track', function () {
            var tracker = new Tracker('t1');
            assert.throws(function () {
                tracker.track('e1');
            });
        });

        it('should always include `domain` parameter when making XHR call', function (done) {
            trackerInstance
                .track('e1')
                .then(function (response) {
                    assert.notStrictEqual(response.config.params.host, undefined);
                    done();
                })
                .catch(done);
        });

        it('should always include `cookie` parameter when making XHR call', function (done) {
            trackerInstance
                .track('e1')
                .then(function (response) {
                    assert.notStrictEqual(response.config.params.cookie, undefined);
                    done();
                })
                .catch(done);
        });

        it('should evaluate returned JavaScript code', function (done) {
            trackerInstance.xhr = axiosmock.createWithResponseData({
                actions: [{
                    type: 'javascript',
                    code: '(function () { return 40 + 2; })();'
                }]
            });

            trackerInstance
                .track('e1')
                .then(function (response) {
                    assert.strictEqual(response.evalResults[0], 42);
                    done();
                })
                .catch(done);
        });

        it('should expose plugins to evaluated JavaScript code', function (done) {
            trackerInstance.xhr = axiosmock.createWithResponseData({
                actions: [{
                    type: 'javascript',
                    code: '(function () { return tracker.square(3); })();'
                }]
            });

            trackerInstance
                .track('e1')
                .then(function (response) {
                    assert.strictEqual(response.evalResults[0], 9);
                    done();
                })
                .catch(done);
        });
    });

    describe('#trackPageView()', function () {
        it('should exist', function () {
            assert.strictEqual((typeof trackerInstance.trackPageView), 'function');
        });

        it('should send default event name (page_view) on XHR call', function (done) {
            trackerInstance
                .trackPageView()
                .then(function (response) {
                    assert.strictEqual(response.config.params.event, 'page_view');
                    done();
                })
                .catch(done);
        });

        it('should send overridden event name on XHR call', function (done) {
            trackerInstance
                .configure({ pageViewEventName: 'test_pv' })
                .trackPageView()
                .then(function (response) {
                    assert.strictEqual(response.config.params.event, 'test_pv');
                    done();
                })
                .catch(done);
        });
    });
});
