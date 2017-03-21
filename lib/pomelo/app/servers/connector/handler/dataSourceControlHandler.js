'use strict';
const co = require('co');
const _ = require('underscore');
const {logger} = require('../../../../../util');
const {createControlService} = require('../../../../../application');
const {pomeloWithZipkinTraceContextFeach:traceContextFeach} = require("gridvo-common-js");

let Handler = function (app) {
    this._app = app;
    this._controlService = createControlService();
};

Handler.prototype.updateConfig = function (msg, session, next) {
    let self = this;
    let {dataSourceID, configs} = msg;
    let traceContext = traceContextFeach(session);

    function joinChannel() {
        return new Promise((resolve, reject) => {
            let channel = self._app.get('channelService').getChannel(`${dataSourceID}-update`, true);
            channel.add(session.uid, self._app.getServerId());
            resolve();
        });
    }

    function updateDataSourceConfig() {
        return new Promise((resolve, reject) => {
            self._controlService.updateDataSourceConfig(dataSourceID, configs, traceContext, (err, isSuccess) => {
                if (err) {
                    reject(err);
                }
                resolve(isSuccess);
            });
        });
    }

    function leaveChannel() {
        return new Promise((resolve, reject) => {
            let channel = self._app.get('channelService').getChannel(`${dataSourceID}-update`, false);
            channel.leave(session.uid, self._app.getServerId());
            resolve();
        });
    }

    function* updateConfig() {
        yield joinChannel();
        let isSuccess = yield updateDataSourceConfig();
        if (!isSuccess) {
            yield leaveChannel();
            logger.warn(`update data source: ${dataSourceID} config fail`, traceContext);
            return {
                errcode: 400,
                errmsg: "fail"
            };
        }
        else {
            logger.info(`start update data source: ${dataSourceID} config`, traceContext);
            return {
                errcode: 0,
                errmsg: "ok"
            };
        }
    };

    co(updateConfig).then((res) => {
        next(null, res);
    }).catch(err => {
        logger.error(err.message, traceContext);
        next(err);
    });
};

Handler.prototype.completeUpdateConfig = function (msg, session, next) {
    let {dataSourceID} = msg;
    let traceContext = traceContextFeach(session);
    let channel = self._app.get('channelService').getChannel(`${dataSourceID}-update`, false);
    if (!channel) {
        logger.error(`get channel: ${dataSourceID}-update error`, traceContext);
        next(null, {
            errcode: 400,
            errmsg: "fail"
        });
        return;
    }
    channel.leave(session.uid, self._app.getServerId());
    logger.info(`update data source: ${dataSourceID} config success`, traceContext);
    next(null, {
        errcode: 0,
        errmsg: "ok"
    });
};

module.exports = function (app) {
    return new Handler(app);
};