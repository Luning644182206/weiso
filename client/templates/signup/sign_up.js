/**
  * @file: WeiSo注册
  * @author: luning@bjutra.com
  * @date: 2017.03.05 21:17
  *
*/

let self = this;
let userType = 'individualUser';// 默认为个人用户
let recommendType = 'internship';// 默认选择为实习生
let msg = {
    EMAILREGEXP: /^(\w)+(\.\w+)*@(\w)+((\.\w{2,5}){1,3})$/
};
import utils from '../../helper/utils.js';

function checkError (type) {
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
    let secretAnswer = {
        value: $('#secretAnswer').val(),
        name: 'secretAnswer'
    };
    let checkData = [loginNumber, passWord, secretAnswer];
    if (type === 'corporateUser') {
        let address = {
            value: $('.address').val(),
            name: 'address'
        };
        let companyName = {
            value: $('.company-name').val(),
            name: 'companyName'
        }
        checkData.push(address);
        checkData.push(companyName);
    }
    _.forEach(checkData, function(data){
        if (!data.value) {
            errors[data.name] = '此项不能为空或格式不正确！';
            isPass = false;
        }
        if (data.name === 'loginNumber' && data.value) {
            isPass = msg.EMAILREGEXP.test(data.value);
            isPass ? '' : errors[data.name] = '此项不能为空或格式不正确！';
        }
    });
    Session.set('SignUpErrors', errors);
    return isPass;
};

function sendData(userType, data) {
    Meteor.call('creatNewAccount', userType, data, function(error ,result) {
        if (error) {
            throwError(error.reason);
        };
        if (result.success) {
            Router.go('/success');
        }
        else {
            throwError(result.massage);
        }
    });
};

Template.signUp.onCreated(function() {
    Session.set('SignUpErrors', {});
});

Template.signUp.helpers({
    questions: function() {
        return SecretQuestions.find();// 密保问题
    },
    provinces: function() {
        return Provinces.find();// 省
    },
    municipalities: function() {
        return Municipalities.findOne({"name": '北京'});// 市
    },
    errorMessage: function(field) {
        return Session.get('SignUpErrors')[field];
    },
    errorClass: function (field) {
        return Session.get('SignUpErrors')[field] ? 'has-error' : '';
    }
});

Template.signUp.events({
    'change .provinces': function(e) {
        let $el = $(e.currentTarget);
        let value = $el.val();
        let cities = Municipalities.findOne({"name": value}).value;
        let municipalities = self.$('.municipalities')[0];
        municipalities.innerHTML = "";
        _.forEach(cities, function (item) {
            // 添加市的名字
            $('<option value= ' + item.name + '>' + item.name + '</option>').appendTo(municipalities);
        });
    },
    'click .individualUser': function(e) {
        let $el = $(e.currentTarget);
        let data = {
            clickElement: $el,
            removeClassElement: '.forIndividualUser',
            removeClass: 'hide',
            addClassElement: '.forCorporateUser',
            addClass: 'hide'
        };
        userType = 'individualUser';
        utils.addRemoveClass(data);
    },
    'click .corporateUser': function(e) {
        let $el = $(e.currentTarget);
        let data = {
            clickElement: $el,
            removeClassElement: '.forCorporateUser',
            removeClass: 'hide',
            addClassElement: '.forIndividualUser',
            addClass: 'hide'
        };
        userType = 'corporateUser';
        utils.addRemoveClass(data);
    },
    'click .internship': function(e) {
        let $el = $(e.currentTarget);
        let data = {
            clickElement: $el,
            removeClassElement: '.full-time',
            removeClass: 'active',
            addClassElement: '.internship',
            addClass: 'active'
        };
        recommendType = 'internship';
        utils.addRemoveClass(data);
    },
    'click .full-time': function(e) {
        let $el = $(e.currentTarget);
        let data = {
            clickElement: $el,
            removeClassElement: '.internship',
            removeClass: 'active',
            addClassElement: '.full-time',
            addClass: 'active'
        };
        recommendType = 'fullTime';
        utils.addRemoveClass(data);
    },
    'click .submit': function(e) {
        let loginNumber = $('#loginNumber').val();
        let passWord = $('#passWord').val();
        let secretQuestion = $('.secretQuestions').val();
        let secretAnswer = $('#secretAnswer').val();
        if (userType === 'individualUser') {
            if (checkError('individualUser')) {
                let data = {
                    loginNumber,
                    passWord,
                    secretQuestion,
                    secretAnswer,
                    recommendType,
                    userType
                };
                sendData(userType, data);
            }
        }
        else {
            if (checkError('corporateUser')) {
                let province = $('.provinces').val();
                let city = $('.municipalities').val();
                let address = $('.address').val();
                let companyName = $('.company-name').val();
                let data = {
                    loginNumber,
                    passWord,
                    secretQuestion,
                    secretAnswer,
                    province,
                    city,
                    userType,
                    companyName
                };
                sendData(userType, data);
            }
        }
    }
});