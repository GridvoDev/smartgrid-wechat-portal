'use strict';
const _ = require('underscore');
const co = require('co');
const should = require('should');
const express = require('express');
const HttpSmartgridLesseeServiceGateway = require('../../../lib/infrastructure/serviceGateway/httpSmartgridLesseeServiceGateway');
const {TraceContext} = require('gridvo-common-js');

describe('HttpSmartgridLesseeServiceGateway use case test', () => {
    let app;
    let server;
    let gateway;
    before(done => {
        function setupExpress() {
            return new Promise((resolve, reject) => {
                app = express();
                app.get('/members/:memberID', (req, res) => {
                    if (req.params.memberID == "wechat-userid") {
                        res.json({
                            errcode: 0,
                            errmsg: "ok",
                            member: {
                                memberID: "wechat-userid",
                                memberInfo: {name: "wechat-name"},
                                stations: ["NWH1", "NWH2"]
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
            gateway = new HttpSmartgridLesseeServiceGateway();
            done();
        }).catch(err => {
            done(err);
        });
    });
    describe('authMember(memberID, traceContext, callback)', () => {
        let traceContext = new TraceContext({
            traceID: "aaa",
            parentID: "bbb",
            spanID: "ccc",
            flags: 1,
            step: 3
        });
        context('auth member)', () => {
            it('should return null if auth fail', done => {
                gateway.authMember("no-id", traceContext, (err, memberJSON) => {
                    _.isNull(memberJSON).should.be.eql(true);
                    done();
                });
            });
            it('is ok', done => {
                gateway.authMember("wechat-userid", traceContext, (err, memberJSON) => {
                    memberJSON.memberID.should.be.eql("wechat-userid");
                    memberJSON.memberInfo.name.should.be.eql("wechat-name");
                    memberJSON.stations.length.should.be.eql(2);
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