/**
  * @file: WeiSo 职位列表
  * @author: luning@bjutra.com
  * @date: 2017.04.03 21:30
  *
*/

// getCorporateJobList: function('s5dhHYB7wobRrfrZ8')


Template.jobList.onCreated(function() {
    Meteor.setTimeout(function() {
        let userInfo = Session.get('userInfo');
        Meteor.call('getCorporateJobList', userInfo._id, function(error ,result) {
            if (error) {
                throwError(error.reason);
            };
            if (result.success) {
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
        console.log(Session)
        return Session.get('corpJobList');
    }
});