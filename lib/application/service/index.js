'use strict';
const MemberService = require('./memberService');
const VisualService = require('./visualService');
const ControlService = require('./controlService');

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

let controlService = null;
function createControlService(single = true) {
    if (single && controlService) {
        return controlService;
    }
    controlService = new ControlService();
    return controlService;
};

module.exports = {
    createMemberService,
    createVisualService,
    createControlService
};