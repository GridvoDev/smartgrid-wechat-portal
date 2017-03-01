'use strict';
const _ = require('underscore');
const co = require('co');
const should = require('should');
const express = require('express');
const bodyParser = require('body-parser');
const HttpDataVisualServiceGateway = require('../../../lib/infrastructure/serviceGateway/httpDataVisualServiceGateway');
const {TraceContext} = require('gridvo-common-js');

describe('HttpDataVisualServiceGateway use case test', () => {
    let app;
    let server;
    let gateway;
    before(done => {
        function setupExpress() {
            return new Promise((resolve, reject) => {
                app = express();
                app.use(bodyParser.json());
                app.post('/visual-config/load', (req, res) => {
                    if (req.body.viewOptions.viewID == "view-id") {
                        res.json({
                            errcode: 0,
                            errmsg: "ok",
                            visualConfig: {
                                "NWH-YL": {
                                    readableName: "雨量",
                                    maxValue: 5000,
                                    minValue: 2000,
                                    interval: 500,
                                    splitNumber: 6
                                }
                            }
                        });
                    }
                    else {
                        res.json({
                            errcode: 400,
                            errmsg: "fail"
                        });
                    }
                });
                server = app.listen(3001, err => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve();
                    }
                });
            });
        };
        function* setup() {
            yield setupExpress();
        };
        co(setup).then(() => {
            gateway = new HttpDataVisualServiceGateway();
            done();
        }).catch(err => {
            done(err);
        });
    });
    describe('loadVisualConfig(viewOptions, dataTypeConfigs, traceContext, callback)', () => {
        let traceContext = new TraceContext({
            traceID: "aaa",
            parentID: "bbb",
            spanID: "ccc",
            flags: 1,
            step: 3
        });
        context('load visual config)', () => {
            it('should return null if load fail', done => {
                let viewOptions = {
                    viewID: "no-view-id",
                    viewUserID: "viewUserID",
                    level: "station"
                };
                let dataTypeConfigs = {
                    YL: {
                        readableName: "",
                        maxValue: 5000,
                        minValue: 2000,
                        interval: 500,
                        splitNumber: 6
                    }
                };
                gateway.loadVisualConfig(viewOptions, dataTypeConfigs, traceContext, (err, visualConfigJSON) => {
                    _.isNull(visualConfigJSON).should.be.eql(true);
                    done();
                });
            });
            it('is ok', done => {
                let viewOptions = {
                    viewID: "view-id",
                    viewUserID: "viewUserID",
                    level: "station"
                };
                let dataTypeConfigs = {
                    YL: {
                        readableName: "",
                        maxValue: 5000,
                        minValue: 2000,
                        interval: 500,
                        splitNumber: 6
                    }
                };
                gateway.loadVisualConfig(viewOptions, dataTypeConfigs, traceContext, (err, visualConfigJSON) => {
                    should.exist(visualConfigJSON["NWH-YL"]);
                    done();
                });
            });
        });
    });
    after(done => {
        function teardownExpress() {
            return new Promise((resolve, reject) => {
                server.close(err => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve();
                    }
                });
            });
        };
        function* teardown() {
            yield teardownExpress();
        };
        co(teardown).then(() => {
            done();
        }).catch(err => {
            done(err);
        })
    });
});