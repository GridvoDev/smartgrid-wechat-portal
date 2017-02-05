'use strict';
const _ = require('underscore');
const should = require('should');
const muk = require('muk');
const MemberService = require('../../../lib/application/service/memberService');

describe('memberService use case test', () => {
    let service;
    before(() => {
        service = new MemberService();
    });
    describe('#auth(memberID, traceContext, callback)', () => {
        context('auth lessee member from smartgrid-lessee microservice)', () => {
            it('return null if auth fail', done => {
                let mockSmartLesseeServiceGateway = {};
                mockSmartLesseeServiceGateway.authMember = (memberID, traceContext, callback) => {
                    callback(null, null);
                };
                muk(service, "_smartLesseeServiceGateway", mockSmartLesseeServiceGateway);
                service.auth("noID", {}, (err, memberJSON) => {
                    _.isNull(memberJSON).should.be.eql(true);
                    done();
                });
            });
            it('return member json if auth success', done => {
                let mockSmartLesseeServiceGateway = {};
                mockSmartLesseeServiceGateway.authMember = (memberID, traceContext, callback) => {
                    callback(null, {
                        memberID: "wechat-userid",
                        memberInfo: {name: "wechat-name"},
                        stations: ["NWH1", "NWH2"]
                    });
                };
                muk(service, "_smartLesseeServiceGateway", mockSmartLesseeServiceGateway);
                service.auth("wechat-userid", {}, (err, memberJSON) => {
                    memberJSON.memberID.should.be.eql("wechat-userid");
                    memberJSON.memberInfo.name.should.be.eql("wechat-name");
                    memberJSON.stations.length.should.be.eql(2);
                    done();
                });
            });
        });
    });
    after(() => {
        muk.restore();
    });
});