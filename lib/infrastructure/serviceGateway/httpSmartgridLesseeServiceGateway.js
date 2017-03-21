'use strict';
const rest = require('rest');
const mime = require('rest/interceptor/mime');
const {restZipkinInterceptor} = require('gridvo-common-js');
const {tracer} = require('../../util');

const {SMARTGRID_LESSEE_SERVICE_HOST = "127.0.0.1", SMARTGRID_LESSEE_SERVICE_PORT = "3001"} = process.env;
class Gateway {
    constructor() {
        this._httpRequest = rest;
    }

    authMember(memberID, traceContext, callback) {
        var url = `http://${SMARTGRID_LESSEE_SERVICE_HOST}:${SMARTGRID_LESSEE_SERVICE_PORT}/members/${memberID}`;
        var options = {
            method: "GET",
            path: url
        };
        let request = this._httpRequest.wrap(restZipkinInterceptor, {
            tracer,
            traceContext,
            serviceName: 'smartgrid-wechat-portal',
            remoteServiceName: 'smartgrid-lessee'
        }).wrap(mime);
        request(options).then(response => {
            let {member, errcode, errmsg} = response.entity;
            if (member && errcode == "0" && errmsg == "ok") {
                callback(null, member);
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