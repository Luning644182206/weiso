/**
  * @file: WeiSo 简历列表js
  * @author: luning@bjutra.com
  * @date: 2017.03.31 21:28
  *
*/

import utils from '../../helper/utils.js';
Template.resumeList.onCreated(function() {
    Session.set('resumeList', []);
    Session.set('HaveResumeList', {noResume: 'true'});
    Meteor.setTimeout(function() {
        let userInfo = Session.get('userInfo');
        Meteor.call('getResumes', userInfo._id, function(error ,result) {
            if (error) {
                throwError(error.reason);
            };
            if (result.success) {
                Session.set('allResumeList', result.resumeList);
                Session.set('HaveResumeList', {haveResume: 'true'});
            }
            else {
                if (result.errorCode !== 0) {
                    throwError(result.massage);
                }
            }
        });
    }, 500);
});

Template.resumeList.helpers({
    resumeList: function() {
        return Session.get('allResumeList');
    },
    haveResume: function(file) {
        return Session.get('HaveResumeList')[file] ? '' : 'hide';
    }
});

Template.resumeList.events({
    'click .delete': function(e) {
        let $el = $(e.target);
        let value = $el.attr('value');
        let resumeID = value.split('/')[0];
        let resumeName = value.split('/')[1];
        Session.set('modal', {massage: '确定要删除' + '"' + resumeName + '"'+ '吗？删除用此简历投递的投递反馈也将被删除！', type: 'resumeDelete'});
        Session.set('resumeDelete', {deleteID: resumeID});
        $('#modalMassages').modal();
    }
});

$(document).ready(function () {
    $('body').on('click', '.modal-footer .modal-submit', function (e) {
        if (Session.get('modal').massage && Session.get('modal').type === 'resumeDelete') {
            let deleteResumeID = [Session.get('resumeDelete')['deleteID']];
            let userInfo = Session.get('userInfo');
            Meteor.call('deleteResume', userInfo._id, deleteResumeID, function(error ,result) {
                console.log()
                if (error) {
                    throwError(error.reason);
                };
                if (result.success) {
                    $('#modalMassages').modal('hide');
                    throwSuccess('删除成功！');
                    Meteor.call('getResumes', userInfo._id, function(error ,result) {
                        if (error) {
                            throwError(error.reason);
                        };
                        if (result.success) {
                            Session.set('allResumeList', result.resumeList);
                            Session.set('HaveResumeList', {haveResume: 'true'});
                        }
                        else {
                            if (result.errorCode !== 0) {
                                throwError(result.massage);
                            }
                            else {
                                Session.set('HaveResumeList', {noResume: 'true'});
                            }
                        }
                    });
                }
                else {
                    throwError(result.massage);
                }
            });
        }
    });
});

