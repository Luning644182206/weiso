/**
  * @file: WeiSo dealResume js
  * @author: luning@bjutra.com
  * @date: 2017.04.01 10:45
  *
*/

import utils from '../../helper/utils.js';
Template.dealResume.onCreated(function() {
    let jobID = this.data;
    Session.set('resumeList', []);
    Meteor.setTimeout(function() {
        let userID = Session.get('userInfo')._id;
        Meteor.call('getApplyResumeList', jobID, function(error ,result) {
            if (error) {
                throwError(error.reason);
            };
            if (result.success) {
                console.log(result)
                Session.set('resumeList', result.resumeList);
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
    }
});

Template.dealResume.events({
    'click .apply': function(e) {
        let $el = $(e.target);
        let value = $el.attr('value');
        feedbackID = value;
        Session.set('modal', {chooseResume: 'chooseResume'});
        let $modal = $('#myModal');
        $('#myModal').modal();
    }
});