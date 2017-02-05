'use strict';
const HttpSmartLesseeServiceGateway = require('./httpSmartLesseeServiceGateway');

let gateway = null;
function createSmartLesseeServiceGateway(single = true) {
    if (single && gateway) {
        return gateway;
    }
    gateway = new HttpSmartLesseeServiceGateway();
    return gateway;
};

module.exports = {
    createSmartLesseeServiceGateway
};