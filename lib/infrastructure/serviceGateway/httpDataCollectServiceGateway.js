'use strict';
const rest = require('rest');
const mime = require('rest/interceptor/mime');
const {restZipkinInterceptor} = require('gridvo-common-js');
const {tracer} = require('../../util');

const {DATA_COLLECT_SERVICE_HOST = "127.0.0.1", DATA_COLLECT_SERVICE_PORT = "3001"} = process.env;
class Gateway {
    constructor() {
        this._httpRequest = rest;
    }

    updateDataSourceConfig(dataSourceID, configs, traceContext, callback) {
        var url = `http://${DATA_COLLECT_SERVICE_HOST}:${DATA_COLLECT_SERVICE_PORT}/data-sources/${dataSourceID}/update-config`;
        var options = {
            method: "POST",
            path: url,
            entity: {
                configs: configs
            }
        };
        let request = this._httpRequest.wrap(restZipkinInterceptor, {
            tracer,
            traceContext,
            serviceName: 'smartgrid-wechat-portal',
            remoteServiceName: 'data-collect'
        }).wrap(mime, {mime: 'application/json'});
        request(options).then(response => {
            let {errcode, errmsg} = response.entity;
            if (errcode == "0" && errmsg == "ok") {
                callback(null, true);
            }
            else {
                callback(null, false);
            }
        }).catch(err => {
            callback(err);
        });
    }
}

module.exports = Gateway;