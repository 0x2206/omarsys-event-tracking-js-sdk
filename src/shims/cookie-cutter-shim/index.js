'use strict';

module.exports = {
    get: get,
    set: set
};

var cookies = {};

function set(name, value, options) {
    var cookie = cookies[name] || {};
    cookie.value = value;
    cookie.options = options;
    cookies[name] = cookie;
}

function get(name) {
    return cookies[name] ? cookies[name].value : undefined;
}
