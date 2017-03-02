'use strict';
const HttpSmartLesseeServiceGateway = require('./httpSmartLesseeServiceGateway');
const HttpDataVisualServiceGateway = require('./httpDataVisualServiceGateway');

let smartLesseeServiceGateway = null;
function createSmartLesseeServiceGateway(single = true) {
    if (single && smartLesseeServiceGateway) {
        return smartLesseeServiceGateway;
    }
    smartLesseeServiceGateway = new HttpSmartLesseeServiceGateway();
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

module.exports = {
    createSmartLesseeServiceGateway,
    createDataVisualServiceGateway
};