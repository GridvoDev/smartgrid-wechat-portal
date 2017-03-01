'use strict';
const _ = require('underscore');

class Service {
    constructor() {
        this._dataVisualServiceGateway = null;
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
}

module.exports = Service;