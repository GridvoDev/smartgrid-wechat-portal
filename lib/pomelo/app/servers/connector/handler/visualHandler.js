'use strict';
const co = require('co');
const _ = require('underscore');
const {logger} = require('../../../../../util');
const {createVisualService} = require('../../../../../application');
const {pomeloWithZipkinTraceContextFeach:traceContextFeach} = require("gridvo-common-js");

let Handler = function (app) {
    this._app = app;
    this._visualService = createVisualService();
};

Handler.prototype.queryDataSources = function (msg, session, next) {
    let self = this;
    let queryOpt = msg;
    let traceContext = traceContextFeach(session);

    function getDataSources() {
        return new Promise((resolve, reject) => {
            self._visualService.getDataSources(queryOpt, traceContext, (err, dataSourcesJSON) => {
                if (err) {
                    reject(err);
                }
                resolve(dataSourcesJSON);
            });
        });
    }

    function* queryDataSources() {
        let dataSourcesJSON = yield getDataSources();
        if (_.isNull(dataSourcesJSON)) {
            logger.warn(`get data sources fail`, traceContext);
            return {
                errcode: 400,
                errmsg: "fail"
            };
        }
        else {
            logger.info(`get data sources success`, traceContext);
            return {
                errcode: 0,
                errmsg: "ok",
                dataSources: dataSourcesJSON
            };
        }
    };

    co(queryDataSources).then((res) => {
        next(null, res);
    }).catch(err => {
        logger.error(err.message, traceContext);
        next(err);
    });
};

Handler.prototype.obtainVisualConfig = function (msg, session, next) {
    let self = this;
    let {viewID, viewUserID, level, dataTypeConfigs} = msg;
    let traceContext = traceContextFeach(session);

    function loadVisualConfig() {
        return new Promise((resolve, reject) => {
            self._visualService.loadVisualConfig({
                viewID,
                viewUserID,
                level
            }, dataTypeConfigs, traceContext, (err, visualConfigJSON) => {
                if (err) {
                    reject(err);
                }
                resolve(visualConfigJSON);
            });
        });
    }

    function* obtainVisualConfig() {
        let visualConfigJSON = yield loadVisualConfig();
        if (!visualConfigJSON) {
            logger.warn(`load view: ${viewID} to view user: ${viewUserID} visual config fail`, traceContext);
            return {
                errcode: 400,
                errmsg: "fail"
            };
        }
        else {
            logger.info(`load view: ${viewID} to view user: ${viewUserID} visual config success`, traceContext);
            return {
                errcode: 0,
                errmsg: "ok",
                visualConfig: visualConfigJSON
            };
        }
    };

    co(obtainVisualConfig).then((res) => {
        next(null, res);
    }).catch(err => {
        logger.error(err.message, traceContext);
        next(err);
    });
};

Handler.prototype.obtainData = function (msg, session, next) {
    let self = this;
    let {dataSourceID, startTimestamp, endTimestamp, timespan} = msg;
    let traceContext = traceContextFeach(session);

    function loadDatas() {
        return new Promise((resolve, reject) => {
            self._visualService.loadDatas({
                dataSourceID,
                startTimestamp,
                endTimestamp,
                timespan
            }, traceContext, (err, datasJSON) => {
                if (err) {
                    reject(err);
                }
                resolve(datasJSON);
            });
        });
    }

    function* obtainData() {
        let datasJSON = yield loadDatas();
        if (!datasJSON) {
            logger.warn(`load data: ${dataSourceID} fail`, traceContext);
            return {
                errcode: 400,
                errmsg: "fail"
            };
        }
        else {
            logger.info(`load data: ${dataSourceID} success`, traceContext);
            return {
                errcode: 0,
                errmsg: "ok",
                data: datasJSON
            };
        }
    };

    co(obtainData).then((res) => {
        next(null, res);
    }).catch(err => {
        logger.error(err.message, traceContext);
        next(err);
    });
};

Handler.prototype.subData = function (msg, session, next) {
    let {dataSourceID, viewID, viewUserID} = msg;
    let traceContext = traceContextFeach(session);
    let channel = this._app.get('channelService').getChannel(dataSourceID, true);
    channel.add(session.uid, this._app.getServerId());
    logger.info(`view: ${viewID} and viewUser: ${viewUserID} sub data: ${dataSourceID} success`, traceContext);
    next(null, {
        errcode: 0,
        errmsg: "ok"
    });
};

Handler.prototype.unSubData = function (msg, session, next) {
    let {dataSourceID, viewID, viewUserID} = msg;
    let traceContext = traceContextFeach(session);
    let channel = this._app.get('channelService').getChannel(dataSourceID, false);
    if (!channel) {
        logger.error(`get channel: ${dataSourceID} error`, traceContext);
        next(null, {
            errcode: 400,
            errmsg: "fail"
        });
        return;
    }
    channel.leave(session.uid, this._app.getServerId());
    logger.info(`view: ${viewID} and viewUser: ${viewUserID} un sub data: ${dataSourceID} success`, traceContext);
    next(null, {
        errcode: 0,
        errmsg: "ok"
    });
};

module.exports = function (app) {
    return new Handler(app);
};