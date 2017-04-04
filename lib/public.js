/**
  * @file: WeiSo服务器端公用的方法
  * @author: luning@bjutra.com
  * @date: 2017.03.34 14:37
  *
*/

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
            let creatTime = date.toUTCString();
            date.setTime(date.getTime() + 30 * 24 * 60 * 60 * 1000);// 过期时间设置为1个月
            let endTime = date.toUTCString();

            jobData.creatTime = creatTime
            jobData.modifiedTime = creatTime;
            jobData.endTime = endTime;
            jobData.intrest = 0;// 感兴趣的
            jobData.eliminate = 0;// 淘汰的
            jobData.unread = 0;// 未阅读的
            jobData.jobStatus = "正在进行";
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
    }
});