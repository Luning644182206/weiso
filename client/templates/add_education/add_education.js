/**
  * @file: WeiSo 添加学历背景
  * @author: luning@bjutra.com
  * @date: 2017.05.11 21:17
  *
*/
let modalData = {};
Template.addEducation.helpers({
    errorMessage: function(field) {
        return Session.get('modalError')[field];
    },
    errorClass: function (field) {
        return Session.get('modalError')[field] ? 'has-error' : '';
    }
});
Template.modal.onCreated(function() {
    Session.set('modalError', {});
});

window.checkEducationError = function () {
    let isPass = true;
    let errors = {};
    modalData = {};
    modalData.modalType = 'addEducation';
    let school = {
        value: $('#addEducationSchool').val(),
        name: 'addEducationSchool'
    };
    let business = {
        value: $('#addEducationBusiness').val(),
        name: 'addEducationBusiness'
    };
    let education = {
        value: $('#addEducationEducation').val(),
        name: 'addEducationEducation'
    };
    let timeIn = {
        value: $('#addEducationtimeIn').val(),
        name: 'addEducationtimeIn'
    };
    let timeOut = {
        value: $('#addEducationtimeOut').val(),
        name: 'addEducationtimeOut'
    };
    let checkData = [school, business, timeIn, timeOut, education];
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
        if (Session.get('modal').addEducation) {
            let isPass = window.checkEducationError();
            if (isPass) {
                Session.set('modalDataReturn', modalData);
                $('#myModal').modal('hide');
            }
        }
    });
});