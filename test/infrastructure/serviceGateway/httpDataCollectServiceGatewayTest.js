'use strict';
const _ = require('underscore');
const co = require('co');
const should = require('should');
const express = require('express');
const bodyParser = require('body-parser');
const HttpDataCollectServiceGateway = require('../../../lib/infrastructure/serviceGateway/httpDataCollectServiceGateway');
const {TraceContext} = require('gridvo-common-js');

describe('HttpDataCollectServiceGateway use case test', () => {
    let app;
    let server;
    let gateway;
    before(done => {
        function setupExpress() {
            return new Promise((resolve, reject) => {
                app = express();
                app.use(bodyParser.json());
                app.get('/data-sources', (req, res) => {
                    res.json({
                        errcode: 0,
                        errmsg: "ok",
                        dataSources: [{
                            id: "NWH-SW-SH"
                        }]
                    });
                });
                app.post('/data-sources/:dataSourceID/update-config', (req, res) => {
                    if (req.params.dataSourceID == "data-source-id") {
                        res.json({
                            errcode: 0,
                            errmsg: "ok",
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
            gateway = new HttpDataCollectServiceGateway();
            done();
        }).catch(err => {
            done(err);
        });
    });
    describe('getDataSources(queryOpts, traceContext, callback)', () => {
        let traceContext = new TraceContext({
            traceID: "aaa",
            parentID: "bbb",
            spanID: "ccc",
            flags: 1,
            step: 3
        });
        context('get data sources)', () => {
            it('should return data sources"', done => {
                let queryOpts = {};
                gateway.getDataSources(queryOpts, traceContext, (err, dataSourcesJSON) => {
                    dataSourcesJSON.length.should.be.eql(1);
                    done();
                });
            });
        });
    });
    describe('updateDataSourceConfig(dataSourceID, configs, traceContext, callback)', () => {
        let traceContext = new TraceContext({
            traceID: "aaa",
            parentID: "bbb",
            spanID: "ccc",
            flags: 1,
            step: 3
        });
        context('update data source config)', () => {
            it('should return false if update fail', done => {
                let dataSourceID = "no-data-source";
                let configs = {
                    FWJ: 60
                };
                gateway.updateDataSourceConfig(dataSourceID, configs, traceContext, (err, isSuccess) => {
                    if (err) {
                        done(err);
                    }
                    isSuccess.should.be.eql(false);
                    done();
                });
            });
            it('is ok', done => {
                let dataSourceID = "data-source-id";
                let configs = {
                    FWJ: 60
                };
                gateway.updateDataSourceConfig(dataSourceID, configs, traceContext, (err, isSuccess) => {
                    if (err) {
                        done(err);
                    }
                    isSuccess.should.be.eql(true);
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