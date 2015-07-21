'use strict';

describe('util', function () {
    var assert = require('assert');
    var util = require('./util');

    describe('#getHost()', function () {
        it('should return hostname if it is available, otherwise undefined', function () {
            // Browserify makes `global` an alias to `window` in browsers
            if (global.location && global.location.hostname) {
                // Browser env
                assert.strictEqual(util.getHost(), 'localhost');
            } else {
                // Node env
                assert.strictEqual(util.getHost(), undefined);
            }
        });
    });

    describe('#isDefined()', function () {
        it('should return false when undefined passed', function () {
            assert.strictEqual(util.isDefined(undefined), false);
        });

        it('should return true when other than undefined passed', function () {
            assert.strictEqual(util.isDefined(false), true);
            assert.strictEqual(util.isDefined(true), true);
            assert.strictEqual(util.isDefined(0), true);
            assert.strictEqual(util.isDefined([]), true);
            assert.strictEqual(util.isDefined({}), true);
            assert.strictEqual(util.isDefined(42), true);
            assert.strictEqual(util.isDefined(-42), true);
            assert.strictEqual(util.isDefined(42.42), true);
            assert.strictEqual(util.isDefined(-42.42), true);
            assert.strictEqual(util.isDefined(Infinity), true);
            assert.strictEqual(util.isDefined(''), true);
            assert.strictEqual(util.isDefined(' \t \n '), true);
            assert.strictEqual(util.isDefined('asd'), true);
        });
    });

    describe('#isEmpty()', function () {
        it('should return true when empty string passed', function () {
            assert.strictEqual(util.isEmpty(''), true);
            assert.strictEqual(util.isEmpty(' '), true);
            assert.strictEqual(util.isEmpty('\n'), true);
            assert.strictEqual(util.isEmpty('\t'), true);
        });

        it('should return true when empty array passed', function () {
            assert.strictEqual(util.isEmpty([]), true);
        });

        it('should return true when empty object passed', function () {
            assert.strictEqual(util.isEmpty({}), true);
        });

        it('should return true when null passed', function () {
            assert.strictEqual(util.isEmpty(null), true);
        });

        it('should return true when undefined passed', function () {
            assert.strictEqual(util.isEmpty(undefined), true);
        });

        it('should return false when boolean passed', function () {
            assert.strictEqual(util.isEmpty(true), false);
            assert.strictEqual(util.isEmpty(false), false);
        });

        it('should return false when number passed', function () {
            assert.strictEqual(util.isString(0), false);
            assert.strictEqual(util.isString(-42), false);
            assert.strictEqual(util.isString(42), false);
            assert.strictEqual(util.isString(-42.42), false);
            assert.strictEqual(util.isString(42.42), false);
            assert.strictEqual(util.isString(Infinity), false);
        });

        it('should return false when string with content other than whitespace passed', function () {
            assert.strictEqual(util.isEmpty('lol'), false);
            assert.strictEqual(util.isEmpty(' lol \t \n'), false);
        });

        it('should return false when non empty array passed', function () {
            assert.strictEqual(util.isEmpty([1, 2, 3]), false);
            assert.strictEqual(util.isEmpty(['a', 'b', 'c']), false);
        });
    });

    describe('#isPlainObject()', function () {
        it('should return true if plain object passed', function () {
            assert.strictEqual(util.isPlainObject({}), true);
            assert.strictEqual(util.isPlainObject(Object.create(null)), true);
        });

        it('should return false if non plain object passed (array, function, regexp, date)', function () {
            assert.strictEqual(util.isPlainObject([1, 2, 3]), false);
            assert.strictEqual(util.isPlainObject(function () {}), false);
            assert.strictEqual(util.isPlainObject(/lol/), false);
            assert.strictEqual(util.isPlainObject(new RegExp('lol')), false);
            assert.strictEqual(util.isPlainObject(new Date()), false);
        });

        it('should return false if non object passed', function () {
            assert.strictEqual(util.isPlainObject(true), false);
            assert.strictEqual(util.isPlainObject(false), false);
            assert.strictEqual(util.isPlainObject(42), false);
            assert.strictEqual(util.isPlainObject(Infinity), false);
            assert.strictEqual(util.isPlainObject('lol'), false);
        });
    });

    describe('#isString()', function () {
        it('should return true when string passed', function () {
            assert.strictEqual(util.isString('lol'), true);
            assert.strictEqual(util.isString(' lol '), true);
            assert.strictEqual(util.isString(''), true);
            assert.strictEqual(util.isString(' '), true);
            assert.strictEqual(util.isString('\t'), true);
            assert.strictEqual(util.isString('\n'), true);
        });

        it('should return false when number passed', function () {
            assert.strictEqual(util.isString(0), false);
            assert.strictEqual(util.isString(-42), false);
            assert.strictEqual(util.isString(42), false);
            assert.strictEqual(util.isString(-42.42), false);
            assert.strictEqual(util.isString(42.42), false);
            assert.strictEqual(util.isString(Infinity), false);
        });

        it('should return false when array passed', function () {
            assert.strictEqual(util.isString([]), false);
            assert.strictEqual(util.isString([1, 2, 3]), false);
            assert.strictEqual(util.isString(['a', 'b', 'c']), false);
        });

        it('should return false when object passed', function () {
            assert.strictEqual(util.isString({}), false);
            assert.strictEqual(util.isString({a: 1, b: 2}), false);
        });

        it('should return false when boolean passed', function () {
            assert.strictEqual(util.isString(true), false);
            assert.strictEqual(util.isString(false), false);
        });

        it('should return false when undefined passed', function () {
            assert.strictEqual(util.isString(undefined), false);
        });
    });

    describe('#merge()', function () {
        it('should throw when less than 2 objects passed', function () {
            assert.throws(function () { util.merge(); }, TypeError);
            assert.throws(function () { util.merge([{}]); }, RangeError);
        });

        it('should throw when non objects passed', function () {
            assert.throws(function () { util.merge(['lol', 42]); }, TypeError);
            assert.throws(function () { util.merge(['lol', {}]); }, TypeError);
            assert.throws(function () { util.merge([[], []]); }, TypeError);
        });

        it('should return new object', function () {
            var o1 = {a1: 'a1', b1: 'b1'};
            var o2 = {a2: 'a2', b2: 'b2'};
            var merged = util.merge([o1, o2]);
            assert.notDeepEqual(merged, o1);
            assert.notDeepEqual(merged, o2);
        });

        it('should return merged object from right to left', function () {
            var o1 = {o1: 'o1'};
            var o2 = {o2: 'o2'};
            var o3 = {o3: 'o3'};
            var o4 = {o1: 'o4'};
            assert.deepEqual(util.merge([o1, o2, o3, o4]), {o1: 'o4', o2: 'o2', o3: 'o3'});
        });
    });

    describe('#whitelist()', function () {
        it('should return new object', function () {
            var o1 = {};
            var o2 = util.whitelist(o1, []);
            assert.notStrictEqual(o1, o2);
        });

        it('should contain only whitelisted keys', function () {
            var o1 = {a: 'a', b: 'b', c: 'c'};
            var o2 = util.whitelist(o1, ['b', 'c']);
            assert.strictEqual(o2.hasOwnProperty('a'), false);
            assert.strictEqual(o2.hasOwnProperty('b'), true);
            assert.strictEqual(o2.hasOwnProperty('c'), true);
        });
    });
});
