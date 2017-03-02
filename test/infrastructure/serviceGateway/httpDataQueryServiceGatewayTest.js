'use strict';
const _ = require('underscore');
const co = require('co');
const should = require('should');
const express = require('express');
const HttpDataQueryServiceGateway = require('../../../lib/infrastructure/serviceGateway/httpDataQueryServiceGateway');
const {TraceContext} = require('gridvo-common-js');

describe('HttpDataQueryServiceGateway use case test', () => {
    let app;
    let server;
    let gateway;
    before(done => {
        function setupExpress() {
            return new Promise((resolve, reject) => {
                app = express();
                app.get('/datas/:dataSourceID', (req, res) => {
                    if (req.params.dataSourceID == "data-source-id") {
                        res.json({
                            errcode: 0,
                            errmsg: "ok",
                            result: {
                                dataSource: "data-source-id",
                                startTimestamp: 1,
                                endTimestamp: 2,
                                datas: [{v: 100, t: 2},
                                    {v: 100, t: 3}]
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
            gateway = new HttpDataQueryServiceGateway();
            done();
        }).catch(err => {
            done(err);
        });
    });
    describe('queryData(queryOpt, traceContext, callback)', () => {
        let traceContext = new TraceContext({
            traceID: "aaa",
            parentID: "bbb",
            spanID: "ccc",
            flags: 1,
            step: 3
        });
        context('query data)', () => {
            it('should return null if query fail', done => {
                let queryOpt = {
                    dataSourceID: "no-data-source-id",
                    startTimestamp: 1,
                    endTimestamp: 2,
                    timespan: 1
                };
                gateway.queryData(queryOpt, traceContext, (err, datasJSON) => {
                    if(err){
                        done(err);
                    }
                    _.isNull(datasJSON).should.be.eql(true);
                    done();
                });
            });
            it('is ok', done => {
                let queryOpt = {
                    dataSourceID: "data-source-id",
                    startTimestamp: 1,
                    endTimestamp: 2,
                    timespan: 1
                };
                gateway.queryData(queryOpt, traceContext, (err, datasJSON) => {
                    if(err){
                       done(err);
                    }
                    datasJSON.dataSource.should.be.eql("data-source-id");
                    datasJSON.datas.length.should.be.eql(2);
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