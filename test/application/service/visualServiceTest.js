'use strict';
const _ = require('underscore');
const should = require('should');
const muk = require('muk');
const VisualService = require('../../../lib/application/service/visualService');

describe('visualConfigService use case test', () => {
    let service;
    before(() => {
        service = new VisualService();
    });
    describe('#loadVisualConfig(viewOptions, dataTypeConfigs, traceContext, callback)', () => {
        context('load visualConfig from data-visual microservice)', () => {
            it('return null if no viewOptions or dataTypeConfigs', done => {
                service.loadVisualConfig({}, null, {}, (err, visualConfigJSON) => {
                    _.isNull(visualConfigJSON).should.be.eql(true);
                    done();
                });
            });
            it('return null if no this config', done => {
                let mockDataVisualServiceGateway = {};
                mockDataVisualServiceGateway.loadVisualConfig = (viewOptions, dataTypeConfigs, traceContext, callback) => {
                    callback(null, null);
                };
                muk(service, "_dataVisualServiceGateway", mockDataVisualServiceGateway);
                let viewOptions = {
                    viewID: "viewID",
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
                service.loadVisualConfig(viewOptions, dataTypeConfigs, {}, (err, visualConfigJSON) => {
                    _.isNull(visualConfigJSON).should.be.eql(true);
                    done();
                });
            });
            it('return visualConfig json', done => {
                let mockDataVisualServiceGateway = {};
                mockDataVisualServiceGateway.loadVisualConfig = (viewOptions, dataTypeConfigs, traceContext, callback) => {
                    callback(null, {
                        "NWH-YL": {
                            readableName: "雨量",
                            maxValue: 5000,
                            minValue: 2000,
                            interval: 500,
                            splitNumber: 6
                        }
                    });
                };
                muk(service, "_dataVisualServiceGateway", mockDataVisualServiceGateway);
                let viewOptions = {
                    viewID: "viewID",
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
                service.loadVisualConfig(viewOptions, dataTypeConfigs, {}, (err, visualConfigJSON) => {
                    should.exist(visualConfigJSON["NWH-YL"]);
                    done();
                });
            });
        });
    });
    after(() => {
        muk.restore();
    });
});