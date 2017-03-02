'use strict';
const rest = require('rest');
const mime = require('rest/interceptor/mime');
const {restZipkinInterceptor} = require('gridvo-common-js');
const {tracer} = require('../../util');

const {DATA_QUERY_SERVICE_HOST = "127.0.0.1", DATA_QUERY_SERVICE_PORT = "3001"} = process.env;
class Gateway {
    constructor() {
        this._httpRequest = rest;
    }

    queryData(queryOpt, traceContext, callback) {
        let {
            dataSourceID,
            startTimestamp,
            endTimestamp,
            timespan
        } = queryOpt;
        var url = `http://${DATA_QUERY_SERVICE_HOST}:${DATA_QUERY_SERVICE_PORT}/datas/${dataSourceID}?startTimestamp=${startTimestamp}&endTimestamp=${endTimestamp}&timespan=${timespan}`;
        var options = {
            method: "GET",
            path: url
        };
        let request = this._httpRequest.wrap(restZipkinInterceptor, {
            tracer,
            traceContext,
            serviceName: 'smartgrid-wechat-portal',
            remoteServiceName: 'data-query'
        }).wrap(mime);
        request(options).then(response => {
            let {result:datas, errcode, errmsg} = response.entity;
            if (errcode == "0" && errmsg == "ok") {
                callback(null, datas);
            }
            else {
                callback(null, null);
            }
        }).catch(err => {
            callback(err);
        });
    }
}

module.exports = Gateway;