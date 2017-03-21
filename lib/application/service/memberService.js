'use strict';
const _ = require('underscore');
const {createSmartgridLesseeServiceGateway} = require("../../infrastructure");

class Service {
    constructor() {
        this._smartgridLesseeServiceGateway = createSmartgridLesseeServiceGateway();
    }

    auth(memberID, traceContext, callback) {
        if (!memberID) {
            callback(null, null);
            return;
        }
        this._smartgridLesseeServiceGateway.authMember(memberID, traceContext, (err, memberJSON) => {
                if (err) {
                    callback(err, null);
                    return;
                }
                callback(null, memberJSON);
            }
        );
    }
}

module.exports = Service;