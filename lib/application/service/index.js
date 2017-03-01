'use strict';
const MemberService = require('./memberService');
const VisualService = require('./visualService');

let memberService = null;
function createMemberService(single = true) {
    if (single && memberService) {
        return memberService;
    }
    memberService = new MemberService();
    return memberService;
};

let visualService = null;
function createVisualService(single = true) {
    if (single && visualService) {
        return visualService;
    }
    visualService = new VisualService();
    return visualService;
};

module.exports = {
    createMemberService,
    createVisualService
};