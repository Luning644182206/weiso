/**
  * @file: WeiSo Modal Massages
  * @author: luning@bjutra.com
  * @date: 2017.04.16 14:37
  *
*/
$(function() {
    $('#modalMassages').modal('hide');
});

Template.modalMassages.onCreated(function() {
    Session.set('modal', {});
});

Template.modalMassages.helpers({
    modalInfo: function(filed) {
        return Session.get('modal')[filed];
    }
});