/**
  * @file: WeiSo服务器端公用的方法
  * @author: luning@bjutra.com
  * @date: 2017.03.34 14:37
  *
*/
// 扩展Date对象的属性  
Date.prototype.format = function (format) {  
    var o = {  
        "M+": this.getMonth() + 1, //month  
        "d+": this.getDate(), //day  
        "h+": this.getHours(), //hour  
        "m+": this.getMinutes(), //minute  
        "s+": this.getSeconds(), //second  
        "q+": Math.floor((this.getMonth() + 3) / 3), //quarter  
        "S": this.getMilliseconds() //millisecond  
    }  
    if (/(y+)/.test(format))  
        format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));  
    for (var k in o)  
        if (new RegExp("(" + k + ")").test(format))  
            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));  
    return format;  
};
function transTime(time) {
    time = new Date(time);
    time = time.getTime();
    time = new Date(time).format("yyyy-MM-dd hh:mm:ss");
    return time;
};

// 刷新职位状态并可以返回正在进行中的职位
function refreshJobState () {
    let date = new Date();
    let nowTime = date.getTime();
    let allJobs = [];
    let availableJobs = [];
    allJobs = JobList.find().fetch();// .fetch()
    _.forEach(allJobs, function(job) {
        // 只处理因为时间过期的job，不包含手动强制过期的job
        if (job.endTime < nowTime) {
            JobList.update(job._id, {$set: {'jobStatus': false}});
        }
    });
    allJobs = JobList.find().fetch();// 重新获取到职位信息
    _.forEach(allJobs, function(job) {
        // 在有效期内的job
        if (job.jobStatus) {
            availableJobs.push(job);
        }
    });
    return availableJobs;// 将可用的job信息返回
};


Meteor.methods({
    creatNewAccount: function(userType ,accountInfo) {
        let noSame = false;// 该账户名已被注册
        let success = false;// 没有创建成功
        let massage = '';
        let result = {};// 返回结果
        let creatTime = new Date().toUTCString();
        accountInfo = _.extend({creatTime}, accountInfo);
        let checkSame = userType === 'individualUser' ? IndividualUsers.findOne({'loginNumber': accountInfo.loginNumber}) : CorporateUsers.findOne({'loginNumber': accountInfo.loginNumber});
        noSame = checkSame ? false : true;
        if (noSame) {
            let creat = userType === 'individualUser' ? IndividualUsers.insert(accountInfo) : CorporateUsers.insert(accountInfo);
            success = creat ? true : false;
            massage = success ? '' : '创建失败！';
        }
        else {
            massage = '该邮箱已被注册，请更换邮箱重试！';
        }
        result = {
            massage,
            success
        };
        return result;
    },
    signIn: function(userType ,accountInfo) {
        let success = false;// 没有验证成功
        let massage = '';
        let result = {};// 返回结果
        let userInfo = {};
        userInfo = userType === 'individualUser' ? IndividualUsers.findOne({'loginNumber': accountInfo.loginNumber}) : CorporateUsers.findOne({'loginNumber': accountInfo.loginNumber});
        if (userInfo) {
            success = accountInfo.passWord === userInfo.passWord ? true : false;
            massage = success ? '' : '账户名或密码不正确！';
        }
        else {
            massage = success ? '' : '账户名或密码不正确！';
        }
        result = {
            userInfo,
            success,
            massage
        };
        return result;
    },
    user: function(userType ,userID) {
        let success = false;// 获取失败
        let massage = '';
        let result = {};// 返回结果
        let userInfo = {};
        userInfo = userType === 'individualUser' ? IndividualUsers.findOne({'_id': userID}) : CorporateUsers.findOne({'_id': userID});
        if (userInfo) {
            success = true;
        }
        else {
            massage = success ? '' : '无效的用户ID!';
        }
        result = {
            userInfo,
            success,
            massage
        };
        return result;
    },
    creatNewJob: function(userType ,userID, jobData) {
        let success = false;// 获取失败
        let massage = '';
        let result = {};// 返回结果
        let jobInfo = {};
        let isCorporate = userType === 'corporateUser' ?  true : false;
        isCorporate = CorporateUsers.findOne({'_id': userID}) === '' ? false : true;
        if (isCorporate) {
            let date = new Date();
            let creatTime = date.getTime();
            date.setTime(creatTime + 30 * 24 * 60 * 60 * 1000);// 过期时间设置为1个月
            let endTime = date.getTime();

            jobData.creatTime = creatTime;
            jobData.modifiedTime = creatTime;
            jobData.endTime = endTime;
            jobData.intrest = 0;// 感兴趣的
            jobData.eliminate = 0;// 淘汰的
            jobData.unread = 0;// 未阅读的
            jobData.jobStatus = true;// 职位正在进行
            let jobID = JobList.insert(jobData);
            if (jobID) {
                success = CorporateUsers.update(userID, {$push: {'jobListID': jobID}}) ? true : false;
                jobInfo = JobList.findOne({'_id': jobID});
            }
        }
        else {
            massage = success ? '' : '您无权发布职位，请使用企业用户重新登录！';
        }
        result = {
            jobInfo,
            success,
            massage
        };
        return result;
    },
    getCorporateJobList: function(userID, singleJobID) {
        // 接口提供查询所有的job和单一的job
        let success = false;// 获取失败
        let findAllJobs = true;// 默认是查询所有的jobs
        let massage = '';
        let result = {};// 返回结果
        let jobList = [];
        let userInfo = {};
        userInfo = CorporateUsers.findOne({'_id': userID});
        refreshJobState();
        if (userInfo) {
            findAllJobs = singleJobID ? false : true;
            if (findAllJobs) {
                // 获得所有职位信息
                let jobListIDs = userInfo.jobListID;
                _.forEach(jobListIDs, function(jobID) {
                    let job = {};
                    let creatTime;
                    let endTime;
                    job = JobList.findOne({'_id': jobID});
                    job.creatTime = transTime(job.creatTime);
                    job.endTime = transTime(job.endTime);
                    jobList.push(job);
                });
                success = true;
            }
            else {
                // 获得单一职位信息
                let haveThisJob = false;// 默认没有这个职位
                let jobListIDs = userInfo.jobListID;
                _.forEach(jobListIDs, function(jobID) {
                    // 确保用户创建了这个职位
                    if (singleJobID === jobID) {
                        haveThisJob = true;
                    }
                });
                if (haveThisJob) {
                    jobList = JobList.findOne({'_id': singleJobID});
                    success = true;
                }
                else {
                    massage = '您未创建此职位，无法进行编辑！';
                }
            }
        }
        else {
            massage = success ? '' : '无效用户，请咨询客服！';
        }
        result = {
            jobList,
            success,
            massage
        };
        return result;
    },
    updateJobInfo: function(userID, updateJobs) {
        let success = false;// 获取失败
        let massage = '';
        let result = {};// 返回结果
        let jobList = [];
        let userInfo = {};
        userInfo = CorporateUsers.findOne({'_id': userID});
        if (userInfo) {
            let jobListIDs = userInfo.jobListID;
            let successNum = 0;// 记录有几个更新成功了
            _.forEach(updateJobs, function(updateJob) {
                // 确保用户创建了这个职位
                let haveThisJob = false;
                _.forEach(jobListIDs, function(jobID) {
                    if (updateJob._id === jobID) {
                        haveThisJob = true;
                    }
                });
                if (haveThisJob) {
                    let date = new Date();
                    let modifiedTime = date.getTime();
                    let jobID = updateJob._id;
                    delete updateJob._id;// 不能更改id
                    updateJob.modifiedTime = modifiedTime;
                    successNum = JobList.update(jobID, {$set: updateJob}) ? ++successNum : successNum;
                    success = true;
                }
                else {
                    massage = '没有' + updateJob.jobName + '职位信息！操作失败！'
                    success = false;
                }
            });

        }
        else {
            massage = success ? '' : '无效用户，请咨询客服！';
        }
        result = {
            success,
            massage
        };
        return result;
    },
    getJob: function(jobsID) {
        // 查看某个职位的时候或者获取所有有效职位的列表, 支持多个职位查询
        let success = false;// 获取失败
        let massage = '';
        let result = {};// 返回结果
        let jobInfo = [];
        let jobReturn = [];
        jobInfo = refreshJobState();
        if (jobsID) {
            // 这里写的不好，如果有其他方法更好
            _.forEach(jobsID, function(needFindID) {
                _.forEach(jobInfo, function(job) {
                    if (needFindID === job._id) {
                        jobReturn.push(job);
                    }
                });
            });
            if (jobReturn.length === 0) {
                success = false;
                massage = '没有找到相关职位或该职位已过期！';
            }
            else {
                success = true;
            }
        }
        else {
            _.forEach(jobInfo, function(job) {
                job.endTime = transTime(job.endTime);
                jobReturn.push(job);
            });
            success = true;
        }
        result = {
            success,
            massage,
            jobReturn
        };
        return result;
    }
});
// db.jobList.update({"_id": "w86gX9hTWLMo56odT"},{$set: {"jobStatus":"true"}})


