/**
  * @file: WeiSo index js
  * @author: luning@bjutra.com
  * @date: 2017.04.09 18:31
  *
*/

import utils from '../../helper/utils.js';

Template.index.onCreated(function() {
    Session.set('index', {show: 'hide'});
    Session.set('indexJobList', []);
    Meteor.setTimeout(function() {
        Meteor.call('getJob', function(error ,result) {
            if (error) {
                throwError(error.reason);
            };
            if (result.success) {
                let jobs = result.jobReturn;
                let jobTemp = [];
                 _.forEach(jobs, function(job) {
                    job.jobType = utils.transJobInfo[job.jobType];
                    job.education = utils.transJobInfo[job.education];
                    jobTemp.push(job);
                 });
                Session.set('index', {show: ''});
                Session.set('indexJobList', jobTemp);
            }
            else {
                throwError(result.massage);
            }
        });
    },0);
});

Template.index.helpers({
    jobInfo: function() {
        return Session.get('indexJobList');
    }
});