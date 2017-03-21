'use strict';
const _ = require('underscore');
const should = require('should');
const muk = require('muk');
const VisualService = require('../../../lib/application/service/visualService');

describe('visualService use case test', () => {
    let service;
    before(() => {
        service = new VisualService();
    });
    describe('#getDataSources(queryOpt, traceContext, callback)', () => {
        context('query data source from data-collect microservice)', () => {
            it('return dataSources', done => {
                let mockDataCollectServiceGateway = {};
                mockDataCollectServiceGateway.getDataSources = (queryOpt, traceContext, callback) => {
                    callback(null, []);
                };
                muk(service, "_dataCollectServiceGateway", mockDataCollectServiceGateway);
                let queryOpts = {};
                service.getDataSources({}, {}, (err, dataSourcesJSON) => {
                    dataSourcesJSON.length.should.be.eql(0);
                    done();
                });
            });
        });
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
    describe('#loadDatas(queryOpt, traceContext, callback)', () => {
        context('load datas from data-query microservice)', () => {
            it('return null if queryOpt no dataSourceID', done => {
                service.loadDatas({}, {}, (err, datasJSON) => {
                    _.isNull(datasJSON).should.be.eql(true);
                    done();
                });
            });
            it('return null if no this data source', done => {
                let mockDataQueryServiceGateway = {};
                mockDataQueryServiceGateway.queryData = (queryOpt, traceContext, callback) => {
                    callback(null, null);
                };
                muk(service, "_dataQueryServiceGateway", mockDataQueryServiceGateway);
                let queryOpt = {
                    dataSourceID: "no-data-source-id"
                };
                service.loadDatas(queryOpt, {}, (err, datasJSON) => {
                    _.isNull(datasJSON).should.be.eql(true);
                    done();
                });
            });
            it('return datas json', done => {
                let mockDataQueryServiceGateway = {};
                mockDataQueryServiceGateway.queryData = (queryOpt, traceContext, callback) => {
                    callback(null, {
                        dataSource: "data-source-id",
                        startTimestamp: 1,
                        endTimestamp: 2,
                        datas: [{v: 100, t: 2},
                            {v: 100, t: 3}]
                    });
                };
                muk(service, "_dataQueryServiceGateway", mockDataQueryServiceGateway);
                let queryOpt = {
                    dataSourceID: "no-data-source-id",
                    startTimestamp: 1,
                    endTimestamp: 2,
                    timespan: 1
                };
                service.loadDatas(queryOpt, {}, (err, datasJSON) => {
                    datasJSON.dataSource.should.be.eql("data-source-id");
                    datasJSON.datas.length.should.be.eql(2);
                    done();
                });
            });
        });
    });
    after(() => {
        muk.restore();
    });
});