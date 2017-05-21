/**
  * @file: WeiSo 选择简历
  * @author: luning@bjutra.com
  * @date: 2017.05.21 3:27
  *
*/

import utils from '../../helper/utils.js';
Template.chooseResume.onCreated(function() {
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

Template.chooseResume.helpers({
    resumeList: function() {
        return Session.get('resumeList');
    }
});
$(document).ready(function () {
    $('body').on('click', '.modal-footer .modal-submit', function (e) {
        if (Session.get('modal').chooseResume) {
            let modalData = {
                resumeID: $('.resume').val(),
                modalType: 'chooseResume'
            };
            Session.set('modalDataReturn', modalData);
            $('#myModal').modal('hide');
        }
    });
});