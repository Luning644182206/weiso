/**
  * @file: WeiSo 个人控制台
  * @author: luning@bjutra.com
  * @date: 2017.03.31 21:28
  *
*/

import utils from '../../helper/utils.js';
Template.console.onCreated(function() {
    let userType = utils.getCookie('userType');
    if (!userType) {
        Router.go('/signin' + '#' + location.href);
    }
    else {
        if (userType === 'individualUser') {
            Session.set('consoleHide', {manageResume: 'true', feedback: 'true'}); 
        }
        else {
            throwError('企业版用户不能访问此页面！请使用个人用户登录！');
            Session.set('consoleHide', {container: 'userTypeError'});
        }
    }
});

Template.console.helpers({
    hide: function (field) {
        return Session.get('consoleHide')[field] ? 'hide' : '';
    },
    active: function (field) {
        return Session.get('consoleHide')[field] ? '' : 'active';
    }
});

Template.console.events({
    'click .console': function(e) {
        Session.set('consoleHide', {manageResume: 'true', feedback: 'true'});
    },
    'click .manage-resume': function(e) {
        Session.set('consoleHide', {console: 'true', feedback: 'true'});
    },
    'click .feedback': function(e) {
        Session.set('consoleHide', {manageResume: 'true', console: 'true'});
    }
});