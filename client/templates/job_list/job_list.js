/**
  * @file: WeiSo 职位列表
  * @author: luning@bjutra.com
  * @date: 2017.04.03 21:30
  *
*/


Template.jobList.onCreated(function() {
    Session.set('corpJobListSwitch', {haveJob: 'hide'});
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