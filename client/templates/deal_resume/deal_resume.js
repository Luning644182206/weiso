/**
  * @file: WeiSo dealResume js
  * @author: luning@bjutra.com
  * @date: 2017.04.01 10:45
  *
*/

import utils from '../../helper/utils.js';
let jobInfo = {};
Template.dealResume.onCreated(function() {
    let jobID = this.data;
    Session.set('resumeList', []);
    Session.set('resumeContent', {});
    Session.get('resumeListActive', []);
    Session.set('HRState', {});
    Meteor.setTimeout(function() {
        let userID = Session.get('userInfo')._id;
        Meteor.call('getApplyResumeList', jobID, function(error ,result) {
            if (error) {
                throwError(error.reason);
            };
            if (result.success) {
                // 没有做没有数据的情况
                let resumeLists = result.resumeList;
                let dataCurrent = [];
                _.each(resumeLists, resumeList => {
                    resumeList.sex = utils.transJobInfo[resumeList.sex];
                    dataCurrent.push(resumeList);
                })
                jobInfo = result.jobInfo;
                Session.set('resumeContent', dataCurrent[0]);
                Session.set('resumeList', dataCurrent);
            }
            else {
                throwError(result.massage);
            }
        });
    },500);
});

Template.dealResume.helpers({
    resumeList: function(field) {
        return Session.get('resumeList');
    },
    resumeContent: function(field) {
        return Session.get('resumeContent');
    },
    HRState:  function(field) {
        return Session.get('HRState')[field] ? 'active' : '';
    },
});

Template.dealResume.events({
    'click .deal-resume-list-single': function(e) {
        let $el = $(e.currentTarget);
        let value = $el.attr('value');
        let resumeLists = Session.get('resumeList');
        Session.set('HRState', {});
        _.each(resumeLists, resumeList => {
            if (value === resumeList._id) {
                Session.set('resumeContent', resumeList);
                if (resumeList.HRState === 'unread') {
                    let feedbackID = resumeList.feedbackID;
                    HRState = 'read';
                    Meteor.call('updateFeedback', feedbackID, HRState, function(error ,result) {
                        if (error) {
                            throwError(error.reason);
                        };
                        if (!result.success) {
                            throwError(result.massage);
                        }
                    });
                    // 更改job信息中的状态
                    jobInfo.unread = jobInfo.unread - 1;
                    let dataForAPI = [
                        jobInfo
                    ];
                    let userID = utils.getCookie('WEISOID');
                    Meteor.call('updateJobInfo', userID, dataForAPI, function(error ,result) {
                        if (error) {
                            throwError(error.reason);
                        };
                        if (!result.success) {
                            throwError(result.massage);
                        }
                    });
                }
            }
        });
    },
    'click .eliminate': function(e) {
        Session.set('HRState', {eliminate: 'true'});
        changeHRState('eliminate');
    },
    'click .intrest': function(e) {
        Session.set('HRState', {intrest: 'true'});
        changeHRState('intrest');
    },
    'click .write': function(e) {
        Session.set('HRState', {write: 'true'});
        changeHRState('write');
    },
    'click .face': function(e) {
        Session.set('HRState', {face: 'true'});
        changeHRState('face');
    },
    'click .offer': function(e) {
        Session.set('HRState', {offer: 'true'});
        changeHRState('offer');
    }
});

let changeHRState = function (state) {
    let resumeList = Session.get('resumeContent');
    let feedbackID = resumeList.feedbackID;
    let HRState = state;
    Meteor.call('updateFeedback', feedbackID, HRState, function(error ,result) {
        if (error) {
            throwError(error.reason);
        };
        if (result.success) {
            throwSuccess('修改状态成功！');
        }
        else {
            throwError(result.massage);
        }
    });
    let needChangeJob = false;
    if (state === 'intrest' || state === 'eliminate') {
        if (state === 'intrest' && resumeList.HRState === 'eliminate') {
            // 更改job信息中的状态
            jobInfo.intrest = jobInfo.intrest + 1;
            jobInfo.eliminate = jobInfo.eliminate - 1;
            needChangeJob = true;
        }
        else if (state === 'eliminate' && resumeList.HRState === 'intrest') {
            jobInfo.eliminate = jobInfo.eliminate + 1;
            jobInfo.intrest = jobInfo.intrest - 1;
            needChangeJob = true;
        }
        else if (state === 'eliminate' && resumeList.HRState === 'eliminate') {
            needChangeJob = false;
        }
        else if (state === 'intrest' && resumeList.HRState === 'intrest') {
            needChangeJob = false;
        }
        else {
            jobInfo[state] = jobInfo[state] + 1;
            needChangeJob = true;
        }
    }
    if (needChangeJob) {
        let dataForAPI = [
            jobInfo
        ];
        console.log()
        let userID = utils.getCookie('WEISOID');
        Meteor.call('updateJobInfo', userID, dataForAPI, function(error ,result) {
            if (error) {
                throwError(error.reason);
            };
            if (!result.success) {
                throwError(result.massage);
            }
        });
    }
};