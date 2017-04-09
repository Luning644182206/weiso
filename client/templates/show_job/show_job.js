/**
  * @file: WeiSo showJob js
  * @author: luning@bjutra.com
  * @date: 2017.04.01 10:45
  *
*/

import utils from '../../helper/utils.js';
let JobID = '';

Template.showJob.onCreated(function() {
    Session.set('showJob', {show: ''});
    JobID = this.data;
    if (JobID) {
        Session.set('showJob', {show: 'hide'});
        Meteor.setTimeout(function() {
            JobID = [JobID];
            Meteor.call('getJob', JobID, function(error ,result) {
                if (error) {
                    throwError(error.reason);
                };
                if (result.success) {
                    let job = result.jobReturn[0];
                    job.show = '';
                    Session.set('showJob', job);
                }
                else {
                    throwError(result.massage);
                }
            });
        },0);
    }
});

Template.showJob.helpers({
    jobInfo: function(field) {
        // 编辑模式下使用此模板
        let data = utils.transJobInfo[Session.get('showJob')[field]];
        if (data) {
            return data;
        }
        else {
            return Session.get('showJob')[field];
        }
    }
});

// Template.newJob.events({
//     'click .submit': function(e) {
//         let jobName = {
//             value: $('#jobName').val(),
//             name: 'jobName'
//         };
//         let jobDesc = {
//             value: $('#jobDesc').val(),
//             name: 'jobDesc'
//         };
//         let checkData = [jobDesc, jobName];
//         if (checkError(checkData)) {
//             let provinces = $('.address-provinces').text();
//             let city = $('.address-city').text();
//             let address = $('.address-detail').text();
//             let userID = utils.getCookie('WEISOID');
//             let userType = utils.getCookie('userType');
//             // throwSuccess
//             let createJob = {
//                 jobName: jobName.value,
//                 jobDesc: jobDesc.value,
//                 jobType,
//                 education,
//                 provinces,
//                 city,
//                 address
//             };
//             if (editJobID) {
//                 createJob._id = editJobID;
//                 let dataForAPI = [
//                     createJob
//                 ];
//                 Meteor.call('updateJobInfo', userID, dataForAPI, function(error ,result) {
//                     if (error) {
//                         throwError(error.reason);
//                     };
//                     if (result.success) {
//                         throwSuccess('职位信息修改成功！正在返回职位列表请稍后！');
//                         setTimeout(function () {
//                             // 成功后强制刷新
//                             Router.go('/corporate');
//                         },2000);
//                     }
//                     else {
//                         throwError(result.massage);
//                     }
//                 });
//             }
//             else{
//                 Meteor.call('creatNewJob', userType, userID, createJob, function(error ,result) {
//                     if (error) {
//                         throwError(error.reason);
//                     };
//                     if (result.success) {
//                         throwSuccess(result.jobInfo.jobName + '职位发布成功！');
//                         setTimeout(function () {
//                             // 成功后强制刷新
//                             location.reload();
//                         },2000);
//                     }
//                     else {
//                         throwError(result.massage);
//                     }
//                 });
//             }
//         };
//     },
//     'click .education': function(e) {
//         // 通过冒泡批量处理按钮事件
//         let $el = $(e.target);
//         let value = $el.attr('value');
//         let educationChoose = {};
//         educationChoose[value] = value;
//         education = value;
//         Session.set('education', educationChoose);
//     },
//     'click .job-type': function(e) {
//         // 通过冒泡批量处理按钮事件
//         let $el = $(e.target);
//         let value = $el.attr('value');
//         let jobTypeChoose = {};
//         jobTypeChoose[value] = value;
//         jobType = value;
//         Session.set('jobType', jobTypeChoose);
//     },
//     'change .provinces': function(e) {
//         let $el = $(e.currentTarget);
//         let value = $el.val();
//         let cities = Municipalities.findOne({"name": value}).value;
//         let municipalities = self.$('.municipalities')[0];
//         municipalities.innerHTML = "";
//         _.forEach(cities, function (item) {
//             // 添加市的名字
//             $('<option value= ' + item.name + '>' + item.name + '</option>').appendTo(municipalities);
//         });
//     },
//     'click .more': function(e) {
//         // 这样样式实现太复杂，烦躁，要是能用vue就好了。。
//         let data = {
//             removeClassElement: '.new-address',
//             removeClass: 'hide',
//             addClassElement: '',
//             addClass: ''
//         };
//         utils.addRemoveClass(data);
//         setTimeout(function () {
//             let data = {
//                 removeClassElement: '',
//                 removeClass: '',
//                 addClassElement: '.new-address',
//                 addClass: 'active'
//             };
//             utils.addRemoveClass(data);
//         },300);
//     },
//     'click .save-address': function(e) {
//         let checkAddress = [{
//             name: 'address',
//             value: $('.address').val()
//         }];
//         if (checkError(checkAddress)) {
//             // 目前不往数据库存地址更换内容，直接替换当前内容
//             let $oldProvinces = $('.address-provinces');
//             let $oldCity = $('.address-city');
//             let $oldaddress = $('.address-detail');
//             let newProvince = $('.provinces').val();
//             let newCity = $('.municipalities').val();
//             let newAddress = $('.address').val();
//             $oldProvinces.html(newProvince);
//             $oldCity.html(newCity);
//             $oldaddress.html(newAddress);
//             // 这样样式实现太复杂，烦躁，要是能用vue就好了。。
//             let data = {
//                 removeClassElement: '.new-address',
//                 removeClass: 'active',
//                 addClassElement: '',
//                 addClass: ''
//             };
//             utils.addRemoveClass(data);
//             setTimeout(function () {
//                 let data = {
//                     removeClassElement: '',
//                     removeClass: '',
//                     addClassElement: '.new-address',
//                     addClass: 'hide'
//                 };
//                 utils.addRemoveClass(data);
//                 $('.address').val('');// 清除内容
//             },500);
//         }
//     },
//     'click .cancel': function(e) {
//         // 这样样式实现太复杂，烦躁，要是能用vue就好了。。
//         let data = {
//             removeClassElement: '.new-address',
//             removeClass: 'active',
//             addClassElement: '',
//             addClass: ''
//         };
//         utils.addRemoveClass(data);
//         setTimeout(function () {
//             let data = {
//                 removeClassElement: '',
//                 removeClass: '',
//                 addClassElement: '.new-address',
//                 addClass: 'hide'
//             };
//             utils.addRemoveClass(data);
//             $('.address').val('');// 清除内容
//         },500);
//     }
// });

// function checkError (checkInfo) {
//     let isPass = true;
//     let errors = {};
//     _.forEach(checkInfo, function(data){
//         if (!data.value) {
//             errors[data.name] = data.errorMessage ||'此项不能为空哦！';
//             isPass = false;
//         }
//     });
//     Session.set("newJobCheck", errors);
//     return isPass;
// };