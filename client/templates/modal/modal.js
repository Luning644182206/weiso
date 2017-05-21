/**
  * @file: WeiSo modal
  * @author: luning@bjutra.com
  * @date: 2017.04.01 10:45
  *
*/

$(function() {
    $('#myModal').modal('hide');
});

Template.modal.onCreated(function() {
    Session.set('modal', {default: 'default'});
    Session.set('modalError', {});
    Session.set('modalDataReturn', {});
});

Template.modal.helpers({
    modalTemplate: function(field) {
        return Session.get('modal')[field] ? '' : 'hide';
    }
});