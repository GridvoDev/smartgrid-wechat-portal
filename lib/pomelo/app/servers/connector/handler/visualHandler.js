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
        logger.info(`load view: ${viewID} to view user: ${viewUserID} visual config success`, traceContext);
        return {
            errcode: 0,
            errmsg: "ok",
            visualConfig: visualConfigJSON
        };
    };

    co(obtainVisualConfig).then((res) => {
        next(null, res);
    }).catch(err => {
        logger.error(err.message, traceContext);
        next(err);
    });
};

module.exports = function (app) {
    return new Handler(app);
};