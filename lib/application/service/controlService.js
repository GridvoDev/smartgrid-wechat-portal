'use strict';
const _ = require('underscore');
const {createDataCollectServiceGateway} = require("../../infrastructure");

class Service {
    constructor() {
        this._dataCollectServiceGateway = createDataCollectServiceGateway();
    }

    updateDataSourceConfig(dataSourceID, configs, traceContext, callback) {
        if (!dataSourceID || !configs) {
            callback(null, false);
            return;
        }
        this._dataCollectServiceGateway.updateDataSourceConfig(dataSourceID, configs, traceContext, (err, isSuccess) => {
                if (err) {
                    callback(err, null);
                    return;
                }
                callback(null, isSuccess);
            }
        );
    }
}

module.exports = Service;