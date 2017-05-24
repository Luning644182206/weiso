/**
  * @file: WeiSo 职位列表
  * @author: luning@bjutra.com
  * @date: 2017.04.03 21:30
  *
*/


Template.jobList.onCreated(function() {
    Session.set('corpJobListSwitch', {haveJob: 'hide'});
    Session.set('jobListDelete', {deleteID: ''});
    Meteor.setTimeout(function() {
        let userInfo = Session.get('userInfo');
        Meteor.call('getCorporateJobList', userInfo._id, function(error ,result) {
            if (error) {
                throwError(error.reason);
            };
            if (result.success) {
                let haveJob = result.jobList.length ? true : false;
                haveJob && Session.set('corpJobListSwitch', {noJobs: 'hide'});
                Session.set('corpJobList', result.jobList);
            }
            else {
                throwError(result.massage);
            }
        });
    },1000);
});

Template.jobList.helpers({
    jobList: function() {
        return Session.get('corpJobList');
    },
    ishow: function(file) {
        return Session.get('corpJobListSwitch')[file];
    }
});

Template.jobList.events({
    'click .delete-job': function(e) {
        let $el = $(e.target);
        let value = $el.attr('value');
        let jobID = value.split('/')[0];
        let jobName = value.split('/')[1];
        Session.set('modal', {massage: '确定要删除' + jobName + '职位吗？', type: 'jobListDelete'});
        Session.set('jobListDelete', {deleteID: jobID});
        $('#modalMassages').modal();
    }
});

$(document).ready(function () {
    $('body').on('click', '.modal-footer .modal-submit', function (e) {
        if (Session.get('modal').massage && Session.get('modal').type === 'jobListDelete') {
            let deleteJobID = [Session.get('jobListDelete')['deleteID']];
            let userInfo = Session.get('userInfo');
            Meteor.call('deleteJobs', userInfo._id, deleteJobID, function(error ,result) {
                if (error) {
                    throwError(error.reason);
                };
                if (result.success) {
                    $('#modalMassages').modal('hide');
                    throwSuccess('删除成功！');
                    Meteor.call('getCorporateJobList', userInfo._id, function(error ,result) {
                        if (error) {
                            throwError(error.reason);
                        };
                        if (result.success) {
                            let haveJob = result.jobList.length ? true : false;
                            haveJob && Session.set('corpJobListSwitch', {noJobs: 'hide'});
                            Session.set('corpJobList', result.jobList);
                        }
                        else {
                            throwError(result.massage);
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
