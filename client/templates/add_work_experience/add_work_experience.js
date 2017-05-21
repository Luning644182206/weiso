/**
  * @file: WeiSo 添加实习经历
  * @author: luning@bjutra.com
  * @date: 2017.05.11 21:17
  *
*/
let modalData = {};
Template.workExperience.helpers({
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

window.checkWorkERPError = function () {
    let isPass = true;
    let errors = {};
    modalData = {};
    modalData.modalType = 'addWorkExperience';
    let workCompany = {
        value: $('#workCompany').val(),
        name: 'workCompany'
    };
    let workDetail = {
        value: $('#workDetail').val(),
        name: 'workDetail'
    };
    let workTimeIn = {
        value: $('#workTimeIn').val(),
        name: 'workTimeIn'
    };
    let workTimeOut = {
        value: $('#workTimeOut').val(),
        name: 'workTimeOut'
    };
    let checkData = [workCompany, workDetail, workTimeIn, workTimeOut];
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
        if (Session.get('modal').workExperience) {
            let isPass = window.checkWorkERPError();
            if (isPass) {
                Session.set('modalDataReturn', modalData);
                $('#myModal').modal('hide');
            }
        }
    });
});