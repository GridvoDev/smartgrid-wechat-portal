'use strict';
const HttpSmartgridLesseeServiceGateway = require('./httpSmartgridLesseeServiceGateway');
const HttpDataVisualServiceGateway = require('./httpDataVisualServiceGateway');
const HttpDataQueryServiceGateway = require('./httpDataQueryServiceGateway');
const HttpDataCollectServiceGateway = require('./httpDataCollectServiceGateway');

let smartLesseeServiceGateway = null;
function createSmartgridLesseeServiceGateway(single = true) {
    if (single && smartLesseeServiceGateway) {
        return smartLesseeServiceGateway;
    }
    smartLesseeServiceGateway = new HttpSmartgridLesseeServiceGateway();
    return smartLesseeServiceGateway;
};

let dataVisualServiceGateway = null;
function createDataVisualServiceGateway(single = true) {
    if (single && dataVisualServiceGateway) {
        return dataVisualServiceGateway;
    }
    dataVisualServiceGateway = new HttpDataVisualServiceGateway();
    return dataVisualServiceGateway;
};

let dataQueryServiceGateway = null;
function createDataQueryServiceGateway(single = true) {
    if (single && dataQueryServiceGateway) {
        return dataQueryServiceGateway;
    }
    dataQueryServiceGateway = new HttpDataQueryServiceGateway();
    return dataQueryServiceGateway;
};

let dataCollectServiceGateway = null;
function createDataCollectServiceGateway(single = true) {
    if (single && dataCollectServiceGateway) {
        return dataCollectServiceGateway;
    }
    dataCollectServiceGateway = new HttpDataCollectServiceGateway();
    return dataCollectServiceGateway;
};

module.exports = {
    createSmartgridLesseeServiceGateway,
    createDataVisualServiceGateway,
    createDataQueryServiceGateway,
    createDataCollectServiceGateway
};