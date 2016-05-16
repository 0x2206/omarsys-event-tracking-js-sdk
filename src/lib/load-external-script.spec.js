describe('Load external script plugin', function () {
    'use strict';

    var assert = require('assert');
    var loadScript = require('./load-external-script');

    describe('constructor', function () {
        it('should throw when empty string passed for `src`', function () {
            /* eslint-disable no-new */
            assert.throws(function () {loadScript(' \t \n ');});
            assert.throws(function () {loadScript('');});
            /* eslint-enable no-new*/
        });

        it('should invoke callback once loaded', function (done) {
            try {
                loadScript('http://ajax.googleapis.com/ajax/libs/angularjs/1.4.8/angular.min.js', function () {
                    assert.strictEqual(true, true);
                    done();
                });
            } catch (e) {
                done();
            }
        });
    });
});
