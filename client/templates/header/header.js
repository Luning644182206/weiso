/**
  * @file: WeiSo header
  * @author: luning@bjutra.com
  * @date: 2017.03.25 11:30
  *
*/

import utils from '../../helper/utils.js';
let logoutShow = false;
Template.header.onCreated(function() {
    Session.set('loginState', {notLogin: 'notLogin'});
});

Template.header.helpers({
    loginState: function (field) {
        return Session.get('loginState')[field] ? 'hide' : '';
    }
});

// 解决加载时候的延时问题
setInterval(function () {
    let userID = utils.getCookie('WEISOPASSPORT');
    let userType = utils.getCookie('userType');
    if (userID && userType) {
        Meteor.call('user', userType, userID, function(error ,result) {
            if (error) {
                throwError(error.reason);
            };
            if (result.success) {
                let userName = result.userInfo.userName || result.userInfo.loginNumber;
                $('.user-name').text('Hi！' + userName);
                Session.set('loginState', {isLogin: 'isLogin'});
            }
            else {
                throwError(result.massage);
            }
        });
    }
    else {
        Session.set('loginState', {notLogin: 'notLogin'});
    }
},500);

Template.header.events({
    'click .user-name': function(e) {
        if (!logoutShow) {
            $('.logout-btn').removeClass('hide');
            logoutShow = true;
        }
        else {
            $('.logout-btn').addClass('hide');
            logoutShow = false;
        }
    },
    'click .logout-btn': function(e) {
        utils.deleteCookie('WEISOPASSPORT');
        utils.deleteCookie('userType');
        $('.logout-btn').addClass('hide');
        logoutShow = false;
    }
});