/**
  * @file: WeiSo 简历列表js
  * @author: luning@bjutra.com
  * @date: 2017.03.31 21:28
  *
*/

import utils from '../../helper/utils.js';
Template.resumeList.onCreated(function() {
    Session.set('resumeList', []);
    Meteor.setTimeout(function() {
        let userInfo = Session.get('userInfo');
        Meteor.call('getResumes', userInfo._id, function(error ,result) {
            if (error) {
                throwError(error.reason);
            };
            if (result.success) {
                Session.set('resumeList', result.resumeList);
            }
            else {
                throwError(result.massage);
            }
        });
    }, 500);
});

Template.resumeList.helpers({
    resumeList: function() {
        return Session.get('resumeList');
    }
});
