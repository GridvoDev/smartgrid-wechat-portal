'use strict';
const _ = require('underscore');
const {createDataVisualServiceGateway, createDataQueryServiceGateway, createDataCollectServiceGateway} = require("../../infrastructure");

class Service {
    constructor() {
        this._dataVisualServiceGateway = createDataVisualServiceGateway();
        this._dataQueryServiceGateway = createDataQueryServiceGateway();
        this._dataCollectServiceGateway = createDataCollectServiceGateway();
    }

    loadVisualConfig(viewOptions, dataTypeConfigs, traceContext, callback) {
        if (!viewOptions.viewID || !viewOptions.viewUserID || !viewOptions.level || !dataTypeConfigs) {
            callback(null, null);
            return;
        }
        this._dataVisualServiceGateway.loadVisualConfig(viewOptions, dataTypeConfigs, traceContext, (err, visualConfigJSON) => {
                if (err) {
                    callback(err, null);
                    return;
                }
                callback(null, visualConfigJSON);
            }
        );
    }

    loadDatas(queryOpt, traceContext, callback) {
        if (!queryOpt.dataSourceID) {
            callback(null, null);
            return;
        }
        let nowTimestamp = (new Date()).getTime();
        let {dataSourceID, startTimestamp = nowTimestamp - 60 * 60 * 1000, endTimestamp = nowTimestamp, timespan = 60 * 1000} = queryOpt;
        this._dataQueryServiceGateway.queryData({
                dataSourceID,
                startTimestamp,
                endTimestamp,
                timespan
            }, traceContext, (err, datasJSON) => {
                if (err) {
                    callback(err, null);
                    return;
                }
                callback(null, datasJSON);
            }
        );
    }

    getDataSources(queryOpt, traceContext, callback) {
        this._dataCollectServiceGateway.getDataSources(queryOpt, traceContext, (err, dataSourcesJSON) => {
                if (err) {
                    callback(err, null);
                    return;
                }
                callback(null, dataSourcesJSON);
            }
        );
    }
}

module.exports = Service;