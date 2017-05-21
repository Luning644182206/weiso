/**
  * @file: WeiSo 添加校内经历
  * @author: luning@bjutra.com
  * @date: 2017.05.11 21:17
  *
*/
let modalData = {};
Template.schoolExperience.helpers({
    errorMessage: function(field) {
        return Session.get('modalError')[field];
    },
    errorClass: function (field) {
        return Session.get('modalError')[field] ? 'has-error' : '';
    }
});
Template.schoolExperience.onCreated(function() {
    Session.set('modalError', {});
});

window.checkERPError = function () {
    let isPass = true;
    let errors = {};
    modalData = {};
    modalData.modalType = 'addSchoolExperience';
    let erpOrganize = {
        value: $('#erpOrganize').val(),
        name: 'erpOrganize'
    };
    let erpJob = {
        value: $('#erpJob').val(),
        name: 'erpJob'
    };
    let erpTimeIn = {
        value: $('#erpTimeIn').val(),
        name: 'erpTimeIn'
    };
    let erpTimeOut = {
        value: $('#erpTimeOut').val(),
        name: 'erpTimeOut'
    };
    let checkData = [erpOrganize, erpJob, erpTimeIn, erpTimeOut];
    _.forEach(checkData, function(data){
        if (!data.value) {
            errors[data.name] = '此项不能为空！';
            isPass = false;
        }
        else {
            modalData[data.name] = data.value;
        }
    });
    Session.set('modalError', errors);
    return isPass;
};

$(document).ready(function () {
    $('body').on('click', '.modal-footer .modal-submit', function (e) {
        if (Session.get('modal').schoolExperience) {
            let isPass = window.checkERPError();
            if (isPass) {
                Session.set('modalDataReturn', modalData);
                $('#myModal').modal('hide');
            }
        }
    });
});