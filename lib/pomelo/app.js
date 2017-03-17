'use strict';
const fs = require('fs');
const pomelo = require('pomelo');
const MicroprogramConnector = require('gridvo-microprogram-connector');
const {createZipkinFilter} = require('gridvo-common-js');
const CoKafkaConsumer = require('./app/components/kafkaConsumer');
const {logger, tracer} = require('../util');

let app = pomelo.createApp();
const {
    SSL_KEY_PATH = `${__dirname }/keys/gridvocomrsa.key`,
    SSL_CA_PATH = `${__dirname }/keys/1_root_bundle.crt`,
    SSL_CERT_PATH = `${__dirname }/keys/1_www.gridvo.com_bundle.crt`
} = process.env;
app.set('name', 'smartgrid-wechat-portal');
app.configure('production|development', 'connector', () => {
    app.set('connectorConfig',
        {
            connector: MicroprogramConnector,
            ssl: {
                key: fs.readFileSync(SSL_KEY_PATH),
                ca: [fs.readFileSync(SSL_CA_PATH)],
                cert: fs.readFileSync(SSL_CERT_PATH)
            }
        });
    app.load(CoKafkaConsumer, {});
    app.filter(createZipkinFilter({tracer, serviceName: "smartgrid-wechat-portal"}));
    app.set('errorHandler', (err, msg, resp, session, next) => {
        logger.error(err.stack);
    });
});
app.start((err) => {
    if (err) {
        logger.error(`${err.stack}`);
    }
    else {
        logger.info("pomelo app is start");
    }
});
process.on('uncaughtException', err => {
    logger.error(`Caught exception: ${err.stack}`);
});