'use strict';
const co = require('co');
const _ = require('underscore');
const {logger} = require('../../../../../util');
const {createMemberService} = require('../../../../../application');
const {pomeloWithZipkinTraceContextFeach:traceContextFeach} = require("gridvo-common-js");

let Handler = function (app) {
    this._app = app;
    this._memberService = createMemberService();
};

Handler.prototype.entry = function (msg, session, next) {
    if (!msg.memberID) {
        next(null, {
            errcode: 400,
            errmsg: "fail"
        });
        return;
    }
    let self = this;
    let memberID = msg.memberID;
    let traceContext = traceContextFeach(session);

    function authMember(memberID) {
        return new Promise((resolve, reject) => {
            // self._memberService.auth(memberID, traceContext, (err, memberJSON) => {
            //     if (err) {
            //         reject(err);
            //     }
            //     resolve(memberJSON);
            // });
            let memberJSON = {
                memberID: "linmadan",
                memberInfo: {
                    name: "linmadan"
                },
                stations: ["NWHSDZ"]
            };
            resolve(memberJSON);
        });
    }

    function binMemberID(memberID) {
        return new Promise((resolve, reject) => {
            session.bind(memberID, (err) => {
                if (err) {
                    reject(err);
                }
                resolve();
            });
        });
    }

    function binMemberPro(memberJSON) {
        return new Promise((resolve, reject) => {
            session.set('stations', memberJSON.stations);
            session.set('memberInfo', memberJSON.memberInfo);
            session.pushAll((err) => {
                if (err) {
                    reject(err);
                }
                resolve();
            });
        });
    }

    function* memberEntry() {
        let memberJSON = yield authMember(memberID);
        if (!memberJSON) {
            logger.warn(`member: ${memberID} auth fail`, traceContext);
            return {
                errcode: 400,
                errmsg: "fail"
            };
        }
        yield binMemberID(memberID);
        yield binMemberPro(memberJSON);
        session.on('closed', onSessionClosed.bind(null, self._app));
        logger.info(`member: ${memberID} auth success`, traceContext);
        return {
            errcode: 0,
            errmsg: "ok"
        };
    };

    co(memberEntry).then((res) => {
        next(null, res);
    }).catch(err => {
        logger.error(err.message, traceContext);
        next(err);
    });
};

let onSessionClosed = function (app, session) {
    if (!session || !session.uid) {
        logger.info(`invalid member session closed`);
        return;
    }
    logger.info(`member: ${session.uid} session closed`);
}

module.exports = function (app) {
    return new Handler(app);
};
