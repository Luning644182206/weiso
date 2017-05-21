/**
  * @file: WeiSo 添加简历页面
  * @author: luning@bjutra.com
  * @date: 2017.04.16 14:37
  *
*/
let dataPush = {
    schoolExperience: [],
    workExperience: [],
    educationExperience: [],
    rewardExperience: []
};

let schoolCounter = 0;
let workCounter = 0;
let educationCounter = 0;
let rewardCounter = 0;

let checkError = function(checkDoms) {
    let isPass = true;
    let errors = {};
    let checkData = [];
    _.each(checkDoms, dom => {
        let push = {
            value: $('#' + dom).val(),
            name: dom
        };
        checkData.push(push);
    })
    _.forEach(checkData, function(data){
        if (!data.value) {
            errors[data.name] = '此项不能为空哦！';
            isPass = false;
        }
    });
    Session.set("addResumeError", errors);
    return isPass;
};
Template.addResume.onCreated(function() {
    dataPush = {
        schoolExperience: [],
        workExperience: [],
        educationExperience: [],
        rewardExperience: []
    };
    schoolCounter = 0;
    workCounter = 0;
    educationCounter = 0;
    rewardCounter = 0;
});
Template.addResume.helpers({
    errorMessage: function(field) {
        return Session.get('addResumeError')[field];
    },
    errorClass: function (field) {
        return Session.get('addResumeError')[field] ? 'has-error' : '';
    }
});
Template.addResume.events({
    'click .education': function(e){
        Session.set('modal', {addEducation: 'addEducation'});
        let $modal = $('#myModal');
        $('#myModal').modal();
    },
    'click .school-erp': function(e){
        Session.set('modal', {schoolExperience: 'schoolExperience'});
        let $modal = $('#myModal');
        $('#myModal').modal();
    },
    'click .delete': function(e){
        let $el = e.currentTarget;
        $el.parentElement.remove();
        $el = $(e.target);
        let deleteValue = $el.attr('value');
        let value = deleteValue.split('/')[0];
        let name = deleteValue.split('/')[1];
        let datas = dataPush[name];
        let deleteIndex;
        _.forEach(datas, (data, index) => {
            let num = parseInt(value)
            if (data.deleteMark === num) {
                deleteIndex = index;
            }
        })
        console.log(datas)
        datas.splice(deleteIndex, 1);
    },
    'click .work-erp': function(e){
        Session.set('modal', {workExperience: 'workExperience'});
        let $modal = $('#myModal');
        $('#myModal').modal();
    },
    'click .add-reward': function(e){
        Session.set('modal', {addReward: 'addReward'});
        let $modal = $('#myModal');
        $('#myModal').modal();
    },
    'click .save': function(e){
        let checkDoms = ['resumeName', 'name', 'email', 'phone', 'job'];
        let isPass = checkError(checkDoms);
        if (isPass) {
            let userInfo = Session.get('userInfo');
            _.each(dataPush.schoolExperience, (data, index) => {
                delete data.deleteMark;
                dataPush.schoolExperience[index] = data;
            });
            _.each(dataPush.workExperience, (data, index) => {
                delete data.deleteMark;
                dataPush.workExperience[index] = data;
            });
            _.each(dataPush.educationExperience, (data, index) => {
                delete data.deleteMark;
                dataPush.educationExperience[index] = data;
            });
            _.each(dataPush.rewardExperience, (data, index) => {
                delete data.deleteMark;
                dataPush.rewardExperience[index] = data;
            });
            let newResume = {
                resumeName: $('#resumeName').val(),
                name: $('#name').val(),
                email: $('#email').val(),
                phone: $('#phone').val(),
                job: $('#job').val(),
                sex: $('.sex').val(),
                schoolExperience: dataPush.schoolExperience,
                workExperience: dataPush.workExperience,
                educationExperience: dataPush.educationExperience,
                rewardExperience: dataPush.rewardExperience,
                userName: userInfo.userName,
                userSchool: userInfo.school,
                userSex: userInfo.sex,
                userID: userInfo._id
            };
            Meteor.call('creatResume', userInfo._id, newResume, function(error ,result) {
                if (error) {
                    throwError(error.reason);
                };
                if (result.success) {
                    throwSuccess('创建成功!');
                    Router.go('/console');
                }
                else {
                    throwError(result.massage);
                }
            });
        }
    }
});
Tracker.autorun(function() {
  let modalData = Session.get('modalDataReturn') || {};
    if (_.keys(modalData).length) {
        if (modalData.modalType === 'addEducation') {
            let frontNode = $('#new-resume')[0];
            let afterNode = $('#resume-school-erp')[0]; //获取到div3，因为等下要把创建的div插入到div3前面。
            let newEdaucation = document.createElement('div'); //创建一个div元素。
            newEdaucation.innerHTML='<div class="row mt-10">' +
                                    '<div class="col-md-2 ellipsis">' + modalData.addEducationSchool + '</div>' +
                                    '<div class="col-md-2 ellipsis">' + modalData.addEducationEducation + '</div>' +
                                    '<div class="col-md-2 ellipsis">' + modalData.addEducationBusiness + '</div>' +
                                    '<div class="col-md-4 ellipsis">' + modalData.addEducationtimeIn + '-' + modalData.addEducationtimeOut + '</div>' +
                                    '<div class="col-md-2 delete-education delete" value="' + educationCounter + '/educationExperience"> 删除 </div>' +
                                    '</div>';  //给创建出来的div添加内容，内容中可以有html标签嵌套。
            frontNode.insertBefore(newEdaucation, afterNode);
            let push = {
                schoolName: modalData.addEducationSchool,
                degree: modalData.addEducationEducation,
                business: modalData.addEducationBusiness,
                startTime: modalData.addEducationtimeIn,
                endTime: modalData.addEducationtimeOut,
                deleteMark: educationCounter
            }
            educationCounter++;
            dataPush.educationExperience.push(push);
        }
        if (modalData.modalType === 'addSchoolExperience') {
            let frontNode = $('#new-resume')[0];
            let afterNode = $('#resume-work-erp')[0]; //获取到div3，因为等下要把创建的div插入到div3前面。
            let newERP = document.createElement('div'); //创建一个div元素。
            newERP.innerHTML ='<div class="row mt-10">' +
                              '<div class="col-md-4 ellipsis">' + modalData.erpOrganize + '</div>' +
                              '<div class="col-md-2 ellipsis">' + modalData.erpJob + '</div>' +
                              '<div class="col-md-4 ellipsis">' + modalData.erpTimeIn + '-' + modalData.erpTimeOut + '</div>' +
                              '<div class="col-md-2 delete-education delete" value="' + schoolCounter + '/schoolExperience"> 删除 </div>' +
                              '</div>';  //给创建出来的div添加内容，内容中可以有html标签嵌套。
            frontNode.insertBefore(newERP, afterNode);
            let push = {
                organizeName: modalData.erpOrganize,
                job: modalData.erpJob,
                startTime: modalData.erpTimeIn,
                endTime: modalData.erpTimeOut,
                deleteMark: schoolCounter
            }
            schoolCounter++;
            dataPush.schoolExperience.push(push);
        }
        if (modalData.modalType === 'addWorkExperience') {
            let frontNode = $('#new-resume')[0];
            let afterNode = $('#resume-reward')[0]; //获取到div3，因为等下要把创建的div插入到div3前面。
            let newERP = document.createElement('div'); //创建一个div元素。
            newERP.innerHTML = '<div class="row mt-10">' +
                              '<div class="col-md-4 ellipsis">' + modalData.workCompany + '</div>' +
                              '<div class="col-md-2 ellipsis">' + modalData.workDetail + '</div>' +
                              '<div class="col-md-4 ellipsis">' + modalData.workTimeIn + '-' + modalData.workTimeOut + '</div>' +
                              '<div class="col-md-2 delete-education delete" value="' + workCounter + '/workExperience"> 删除 </div>' +
                              '</div>';  //给创建出来的div添加内容，内容中可以有html标签嵌套。
            frontNode.insertBefore(newERP, afterNode);
            let push = {
                workCompany: modalData.workCompany,
                workDetail: modalData.workDetail,
                startTime: modalData.workTimeIn,
                endTime: modalData.workTimeOut,
                deleteMark: workCounter
            }
            workCounter++;
            dataPush.workExperience.push(push);
        }
        if (modalData.modalType === 'addRewardExperience') {
            let frontNode = $('#new-resume')[0];
            let afterNode = $('#resume-end')[0]; //获取到div3，因为等下要把创建的div插入到div3前面。
            let newERP = document.createElement('div'); //创建一个div元素。
            newERP.innerHTML = '<div class="row mt-10">' +
                              '<div class="col-md-4 ellipsis">' + modalData.rewardName + '</div>' +
                              '<div class="col-md-2 ellipsis">' + modalData.rewardDetail + '</div>' +
                              '<div class="col-md-4 ellipsis">' + modalData.rewardTime + '</div>' +
                              '<div class="col-md-2 delete-education delete" value="' + rewardCounter + '/rewardExperience"> 删除 </div>' +
                              '</div>';  //给创建出来的div添加内容，内容中可以有html标签嵌套。
            frontNode.insertBefore(newERP, afterNode);
            let push = {
                rewardName: modalData.rewardName,
                rewardDetail: modalData.rewardDetail,
                rewardTime: modalData.rewardTime,
                deleteMark: rewardCounter
            }
            rewardCounter++;
            dataPush.rewardExperience.push(push);

        }
        Session.set('modal', {});
    }
});