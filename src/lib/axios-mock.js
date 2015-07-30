'use strict';

module.exports = {
    create: create,
    createWithResponseData: createWithResponseData
};

function create() {
    var instance = new AxiosMock();
    return instance.xhr.bind(instance);
}

function createWithResponseData(data) {
    var instance = new AxiosMock(data);
    return instance.xhr.bind(instance);
}

function AxiosMock(data) {
    this.data = data || '';
}

AxiosMock.prototype.xhr = xhr;

function xhr(conf) {
    return Promise.resolve({
        data: this.data,
        status: 200,
        statusText: 'OK',
        headers: {
            date: new Date().toString(),
            server: 'axiosMock',
            'content-length': this.data.length,
            connection: 'close',
            'content-type': 'application/json'
        },
        config: {
            method: conf.method,
            url: conf.url,
            params: conf.params
        }
    });
}
