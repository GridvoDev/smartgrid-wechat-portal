'use strict';
const {Log4jsLogger} = require("gridvo-common-js");

let {IS_DEBUG} = process.env;
let logger = new Log4jsLogger({
    serviceName: "smartgrid-wechat-portal"
});
if (IS_DEBUG) {
    logger.setLevel("debug");
}
module.exports = logger;