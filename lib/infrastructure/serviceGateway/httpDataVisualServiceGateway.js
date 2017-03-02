'use strict';
const rest = require('rest');
const mime = require('rest/interceptor/mime');
const {restZipkinInterceptor} = require('gridvo-common-js');
const {tracer, logger} = require('../../util');

const {DATA_VISUAL_SERVICE_HOST = "127.0.0.1", DATA_VISUAL_SERVICE_PORT = "3001"} = process.env;
class Gateway {
    constructor() {
        this._httpRequest = rest;
    }

    loadVisualConfig(viewOptions, dataTypeConfigs, traceContext, callback) {
        var url = `http://${DATA_VISUAL_SERVICE_HOST}/visual-config/load`;
        var options = {
            method: "POST",
            path: url,
            entity: {
                viewOptions: viewOptions,
                dataTypeConfigs: dataTypeConfigs
            }
        };
        logger.debug(JSON.stringify(options));
        let request = this._httpRequest.wrap(restZipkinInterceptor, {
            tracer,
            traceContext,
            serviceName: 'smartgrid-wechat-portal',
            remoteServiceName: 'data-visual'
        }).wrap(mime, {mime: 'application/json'});
        request(options).then(response => {
            let {visualConfig, errcode, errmsg} = response.entity;
            if (visualConfig && errcode == "0" && errmsg == "ok") {
                callback(null, visualConfig);
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