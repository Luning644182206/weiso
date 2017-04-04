/**
  * @file: WeiSo 企业主页
  * @author: luning@bjutra.com
  * @date: 2017.03.31 21:28
  *
*/

import utils from '../../helper/utils.js';
Template.corporate.onCreated(function() {
    Session.set('optionHide', {newJob: 'true'});
});

Template.corporate.helpers({
    hide: function (field) {
        return Session.get('optionHide')[field] ? 'hide' : '';
    }
});

Template.corporate.events({
    'click .job-list': function(e) {
        let data = {
            removeClassElement: '.new-job',
            removeClass: 'active',
            addClassElement: '.job-list',
            addClass: 'active'
        };
        utils.addRemoveClass(data);
        Session.set('optionHide', {newJob: 'true'});
    },
    'click .new-job': function(e) {
        let data = {
            removeClassElement: '.job-list',
            removeClass: 'active',
            addClassElement: '.new-job',
            addClass: 'active'
        };
        utils.addRemoveClass(data);
        Session.set('optionHide', {jobList: 'true'});
    }
});