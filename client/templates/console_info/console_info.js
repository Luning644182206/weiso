/**
  * @file: WeiSo 企业信息/个人信息js
  * @author: luning@bjutra.com
  * @date: 2017.03.31 21:28
  *
*/

import utils from '../../helper/utils.js';
let checkError = function(checkDoms) {
    let isPass = true;
    let errors = {};
    let checkData = [];
    _.each(checkDoms, dom => {
        let push = {
            value: $('#' + dom).val(),
            name: dom
        };
        checkData.push(push);
    })
    _.forEach(checkData, function(data){
        if (!data.value) {
            errors[data.name] = '此项不能为空哦！';
            isPass = false;
        }
    });
    Session.set("ConsoleInfoError", errors);
    return isPass;
};
Template.consoleInfo.onCreated(function() {
    Session.set('consoleInfoShow', {consoleInfo: 'true'});
    Session.set("ConsoleInfoError", {});
    let userType = utils.getCookie('userType');
    if (userType === 'corporateUser') {
        Session.set('consoleInfoType', {corporateUser: 'true'});
    }
    else {
        let userInfo = Session.get('userInfo');
        let show = {};
        let recommendType = {};
        recommendType = userInfo.recommendType === 'internship' ? {internship: 'internship'} : {fullTime: 'fullTime'};
        Session.set('jobType', recommendType);
        userInfo.userName ? show.consoleInfo = 'true' : show.noInfo = 'true';
        Session.set('consoleInfoShow', show);
        Session.set('consoleInfoType', {individualUser: 'true'});
    }
});

Template.consoleInfo.helpers({
    Type: function(filed) {
        return Session.get('consoleInfoType')[filed] ? '' : 'hide';
    },
    userInfo: function(filed) {
        return Session.get('userInfo')[filed];
    },
    provinces: function() {
        return Provinces.find();// 省
    },
    municipalities: function() {
        return Municipalities.findOne({'name': '北京'});// 市
    },
    show: function(filed) {
        return Session.get('consoleInfoShow')[filed] ? '' : 'hide';
    },
    errorMessage: function(field) {
        return Session.get('ConsoleInfoError')[field];
    },
    errorClass: function (field) {
        return Session.get('ConsoleInfoError')[field] ? 'has-error' : '';
    },
    jobTypeChoose: function (field) {
        return Session.get('jobType')[field] ? 'active' : '';
    }
});

Template.consoleInfo.events({
    'click .change-info': function() {
        let show = {
            changeInfo: 'true'
        };
        Session.set('consoleInfoShow', show);
    },
    'click .job-type': function(e) {
        // 通过冒泡批量处理按钮事件
        let $el = $(e.target);
        let value = $el.attr('value');
        let jobTypeChoose = {};
        jobTypeChoose[value] = value;
        jobType = value;
        Session.set('jobType', jobTypeChoose);
    },
    'click .cancel': function() {
        let userInfo = Session.get('userInfo');
        let userType = userInfo.userType;
        let show = {};
        if (userType === 'individualUser') {
            if (userInfo.username) {
                show.consoleInfo = 'true';
            }
            else {
                show.noInfo = 'true'
            }
        }
        else {
            show.consoleInfo = 'true';
        }
        Session.set("ConsoleInfoError", {});
        Session.set('consoleInfoShow', show);
    },
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
    'click .add-massge': function() {
        Session.set('consoleInfoShow', {changeInfo: 'true'});
    },
    'click .save-change': function() {
        let userType = utils.getCookie('userType');
        if (userType === 'individualUser') {
            let checkDoms = ['userName', 'school', 'edcation', 'phone', 'email'];
            let isPass = checkError(checkDoms);
            if (isPass) {
                let userInfo = Session.get('userInfo');
                userInfo.userName = $('#userName').val();
                userInfo.school = $('#school').val();
                userInfo.education = $('#edcation').val();
                userInfo.phone = $('#phone').val();
                userInfo.email = $('#email').val();
                userInfo.sex = $('.sex').val();
                _.mapKeys(Session.get('jobType'), function(value, key) {
                    userInfo.recommendType = key;
                });
                Meteor.call('changeUserInfo', userType, userInfo, function(error ,result) {
                    if (error) {
                        throwError(error.reason);
                    };
                    if (result.success) {
                        Session.set('userInfo', result.userInfo);
                        let show = {
                            consoleInfo: 'true'
                        };
                        throwSuccess('修改成功！');
                        Session.set('consoleInfoShow', show);
                        // Session.set('userInfo', result.userInfo);
                    }
                    else {
                        throwError(result.massage);
                    }
                });
            }

        }
        else {
            let checkDoms = ['companyName', 'address'];
            let isPass = checkError(checkDoms);
            if (isPass) {
                let userInfo = Session.get('userInfo');
                let companyName = $('#companyName').val();
                let newProvince = $('.provinces').val();
                let newCity = $('.municipalities').val();
                let newAddress = $('#address').val();
                userInfo.address = newAddress;
                userInfo.city = newCity;
                userInfo.province = newProvince;
                userInfo.companyName = companyName;
                Meteor.call('changeUserInfo', userType, userInfo, function(error ,result) {
                    if (error) {
                        throwError(error.reason);
                    };
                    if (result.success) {
                        Session.set('userInfo', result.userInfo);
                        let show = {
                            consoleInfo: 'true'
                        };
                        throwSuccess('修改成功！');
                        Session.set('consoleInfoShow', show);
                        // Session.set('userInfo', result.userInfo);
                    }
                    else {
                        throwError(result.massage);
                    }
                });
            }
        }
        
    }
});