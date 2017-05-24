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

Template.showJob.events({
    'click .submit': function(e) {
        if (Session.get('loginState').notLogin) {
            Router.go('/signin' + '#' + location.href);
        }
        else {
            let userType = utils.getCookie('userType');
            let canApply = false;
            let userInfo = Session.get('userInfo');
            userType === 'corporateUser' ? throwError('企业账户不能申请职位！') : canApply = true;
            if (canApply) {
                if (!userInfo.userName) {
                    canApply = false;
                    throwError('您没有完善个人信息，请完善后再试哦！');
                    setTimeout(function() {
                        Router.go('/console');
                    }, 500);
                }
                if (canApply) {
                    Meteor.setTimeout(function() {
                        let userInfo = Session.get('userInfo');
                        Meteor.call('getResumes', userInfo._id, function(error ,result) {
                            if (error) {
                                throwError(error.reason);
                            };
                            if (result.success) {
                                Session.set('resumeList', result.resumeList);
                                Session.set('modal', {chooseResume: 'chooseResume', callback: 'showJob'});
                                let $modal = $('#myModal');
                                $('#myModal').modal();
                            }
                            else {
                                throwError(result.massage);
                            }
                        });
                    }, 500);
                }
            }
        }
    }
});
Tracker.autorun(function() {
  let modalData = Session.get('modalDataReturn') || {};
    if (_.keys(modalData).length) {
        if (modalData.modalType === 'chooseResume' && modalData.callback === 'showJob') {
            let jobID = Session.get('showJob')._id;
            let resumeID = modalData.resumeID;
            let userID = Session.get('userInfo')._id;
            Meteor.call('applyJob', userID, jobID, resumeID, function(error ,result) {
                if (error) {
                    throwError(error.reason);
                };
                if (result.success) {
                    throwSuccess('已申请成功，请关注反馈结果！');
                }
                else {
                    throwError(result.massage);
                }
            });
        }
        Session.set('modalDataReturn', {});
        Session.set('modal', {});
    }
});