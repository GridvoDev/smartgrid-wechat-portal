'use strict';
const _ = require('underscore');
const {createSmartLesseeServiceGateway} = require("../../infrastructure");

class Service {
    constructor() {
        this._smartLesseeServiceGateway = createSmartLesseeServiceGateway();
    }

    auth(memberID, traceContext, callback) {
        if (!memberID) {
            callback(null, null);
            return;
        }
        this._smartLesseeServiceGateway.authMember(memberID, traceContext, (err, memberJSON) => {
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