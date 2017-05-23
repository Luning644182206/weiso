/**
  * @file: WeiSo feedback js
  * @author: luning@bjutra.com
  * @date: 2017.04.01 10:45
  *
*/

import utils from '../../helper/utils.js';
let feedbackID = '';

Template.feedback.onCreated(function() {
    feedbackID = '';
    Meteor.setTimeout(function() {
        let userID = Session.get('userInfo')._id;
        Meteor.call('getFeedback', userID, function(error ,result) {
            if (error) {
                throwError(error.reason);
            };
            if (result.success) {
                let dataShow = [];
                _.each(result.feedbackData, data => {
                    data.education = utils.transJobInfo[data.education];
                    data.HRStateShow = utils.transJobInfo[data.HRState];
                    dataShow.push(data);
                });
                Session.set('feedbackInfo', dataShow);
            }
            else {
                throwError(result.massage);
            }
        });
    },500);
});

Template.feedback.helpers({
    feedbackInfo: function(field) {
        return Session.get('feedbackInfo');
    }
});

Template.feedback.events({
    'click .apply': function(e) {
        let $el = $(e.target);
        let value = $el.attr('value');
        feedbackID = value;
        Meteor.setTimeout(function() {
            let userInfo = Session.get('userInfo');
            Meteor.call('getResumes', userInfo._id, function(error ,result) {
                if (error) {
                    throwError(error.reason);
                };
                if (result.success) {
                    Session.set('resumeList', result.resumeList);Session.set('modalDataReturn', {});
                    Session.set('modal', {chooseResume: 'chooseResume', callback: 'feedback'});
                    let $modal = $('#myModal');
                    $('#myModal').modal();
                }
                else {
                    throwError(result.massage);
                }
            });
        }, 500);
    }
});
Tracker.autorun(function() {
  let modalData = Session.get('modalDataReturn') || {};
    if (_.keys(modalData).length) {
        if (modalData.modalType === 'chooseResume' && modalData.callback === 'feedback') {
            let resumeID = modalData.resumeID;
            Meteor.call('changeApplyResume', feedbackID, resumeID, function(error ,result) {
                if (error) {
                    throwError(error.reason);
                };
                if (result.success) {
                    throwSuccess('更改成功！');
                }
                else {
                    throwError(result.massage);
                }
            });
        }
        feedbackID = '';
        // Session.set('modal', {});
    }
});