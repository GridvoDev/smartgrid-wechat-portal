'use strict';
const MemberService = require('./memberService');

let memberService = null;
function createMemberService(single = true) {
    if (single && memberService) {
        return memberService;
    }
    memberService = new MemberService();
    return memberService;
};

module.exports = {
    createMemberService
};