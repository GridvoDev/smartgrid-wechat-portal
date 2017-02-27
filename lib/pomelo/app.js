'use strict';
const pomelo = require('pomelo');
const {createZipkinFilter} = require('gridvo-common-js');
const {logger, tracer} = require('../util');

let app = pomelo.createApp();

app.set('name', 'smartgrid-wechat-portal');

app.configure('production|development', 'connector', () => {
    app.set('connectorConfig',
        {
            connector: pomelo.connectors.hybridconnector,
            heartbeat: 100
        });
    app.filter(createZipkinFilter({tracer, serviceName: "smartgrid-wechat-portal"}));
    app.set('errorHandler', (err, msg, resp, session, next) => {
        logger.error(err.stack);
    });
});

app.start((err) => {
    if (err) {
        logger.error(`${err.message}`);
    }
    else {
        logger.info("pomelo app is start");
    }
});

process.on('uncaughtException', err => {
    logger.error(`Caught exception: ${err.stack}`);
});