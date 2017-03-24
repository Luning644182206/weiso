/**
  * @file: WeiSo登录
  * @author: luning@bjutra.com
  * @date: 2017.03.24 17:53
  *
*/

let self = this;
let userType = 'individualUser';// 默认为个人用户
let referrer = document.referrer;
function checkError () {
    let isPass = true;
    let errors = {};
    let loginNumber = {
        value: $('#loginNumber').val(),
        name: 'loginNumber'
    };
    let passWord = {
        value: $('#passWord').val(),
        name: 'passWord'
    };
    let checkData = [loginNumber, passWord];
    _.forEach(checkData, function(data){
        if (!data.value) {
            errors[data.name] = '此项不能为空哦！';
            errors.tip = '账号或密码不能为空！';
            isPass = false;
        }
    });
    Session.set("SignInErrors", errors);
    return isPass;
};

Template.signIn.onCreated(function() {
    Session.set('SignInErrors', {});
});

Template.signIn.helpers({
    errorMessage: function(field) {
        return Session.get('SignInErrors')[field];
    },
    errorClass: function (field) {
        return Session.get('SignInErrors')[field] ? 'has-error' : '';
    }
});

Template.signIn.events({
    'click .individualUser': function(e) {
        userType = 'individualUser';
    },
    'click .corporateUser': function(e) {
        userType = 'corporateUser';
    },
    'click .submit': function(e) {
        let loginNumber = $('#loginNumber').val();
        let passWord = $('#passWord').val();
        let data = {
            loginNumber,
            passWord
        };
        if (checkError()){
            Meteor.call('signIn', userType, data, function(error ,result) {
                if (error) {
                    throwError(error.reason);
                };
                if (result.success) {
                    // if (referrer) {
                    //     location.href = referrer;
                    // }
                    // else {
                    Router.go('/');
                    // }
                }
                else {
                    throwError(result.massage);
                }
            });
        }
    }
});