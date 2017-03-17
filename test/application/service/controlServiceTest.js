'use strict';
const _ = require('underscore');
const should = require('should');
const muk = require('muk');
const ControlService = require('../../../lib/application/service/controlService');

describe('controlService use case test', () => {
    let service;
    before(() => {
        service = new ControlService();
    });
    describe('#updateDataSourceConfig(dataSourceID, configs, traceContext, callback)', () => {
        context('update data source config from data-collect microservice)', () => {
            it('return null if no dataSourceID or configs', done => {
                service.updateDataSourceConfig({}, null, {}, (err, isSuccess) => {
                    isSuccess.should.be.eql(false);
                    done();
                });
            });
            it('return false if no this data source', done => {
                let mockDataCollectServiceGateway = {};
                mockDataCollectServiceGateway.updateDataSourceConfig = (dataSourceID, configs, traceContext, callback) => {
                    callback(null, false);
                };
                muk(service, "_dataCollectServiceGateway", mockDataCollectServiceGateway);
                let dataSourceID = "no-data-source";
                let configs = {
                    FWJ: 60
                };
                service.updateDataSourceConfig(dataSourceID, configs, {}, (err, isSuccess) => {
                    isSuccess.should.be.eql(false);
                    done();
                });
            });
            it('return true if all is ok', done => {
                let mockDataCollectServiceGateway = {};
                mockDataCollectServiceGateway.updateDataSourceConfig = (dataSourceID, configs, traceContext, callback) => {
                    callback(null, true);
                };
                muk(service, "_dataCollectServiceGateway", mockDataCollectServiceGateway);
                let dataSourceID = "no-data-source";
                let configs = {
                    FWJ: 60
                };
                service.updateDataSourceConfig(dataSourceID, configs, {}, (err, isSuccess) => {
                    isSuccess.should.be.eql(true);
                    done();
                });
            });
        });
    });
    after(() => {
        muk.restore();
    });
});