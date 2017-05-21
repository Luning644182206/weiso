/**
  * @file: WeiSo 企业主页
  * @author: luning@bjutra.com
  * @date: 2017.03.31 21:28
  *
*/

import utils from '../../helper/utils.js';
Template.corporate.onCreated(function() {
    let userType = utils.getCookie('userType');
    if (!userType) {
        Router.go('/signin' + '#' + location.href);
    }
    else {
        if (userType === 'individualUser') {
            throwError('个人用户不能访问此页面！请使用企业版用户登录！');
            Session.set('corporateIndexHide', {container: 'userTypeError'});
        }
        else {
            Session.set('corporateIndexHide', {newJob: 'true', jobList: 'true'});
        }
    }
});

Template.corporate.helpers({
    hide: function (field) {
        return Session.get('corporateIndexHide')[field] ? 'hide' : '';
    },
    active: function (field) {
        return Session.get('corporateIndexHide')[field] ? '' : 'active';
    }
});

Template.corporate.events({
    'click .job-list': function(e) {
        Session.set('corporateIndexHide', {newJob: 'true', consoleInfo: 'true'});
    },
    'click .new-job': function(e) {
        Session.set('corporateIndexHide', {jobList: 'true', consoleInfo: 'true'});
    },
    'click .console-info': function(e) {
        Session.set('corporateIndexHide', {newJob: 'true', jobList: 'true'});
    }
});