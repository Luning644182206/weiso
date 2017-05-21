/**
  * @file: WeiSo 添加校内经历
  * @author: luning@bjutra.com
  * @date: 2017.05.11 21:17
  *
*/
let modalData = {};
Template.addReward.helpers({
    errorMessage: function(field) {
        return Session.get('modalError')[field];
    },
    errorClass: function (field) {
        return Session.get('modalError')[field] ? 'has-error' : '';
    }
});
window.checkRewardERPError = function () {
    let isPass = true;
    let errors = {};
    modalData = {};
    modalData.modalType = 'addRewardExperience';
    let rewardName = {
        value: $('#rewardName').val(),
        name: 'rewardName'
    };
    let rewardTime = {
        value: $('#rewardTime').val(),
        name: 'rewardTime'
    };
    let checkData = [rewardName, rewardTime];
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
        if (Session.get('modal').addReward) {
            let isPass = window.checkRewardERPError();
            if (isPass) {
                let rewardDetail = $('#rewardDetail').val() || '';
                modalData.rewardDetail = rewardDetail;
                Session.set('modalDataReturn', modalData);
                $('#myModal').modal('hide');
            }
        }
    });
});