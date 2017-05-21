/**
 * @file: utility function
 * @author: luning@bjutra.com
 * @date: 2017.03.10 21:19
 * */

// 通用方法汇总
let utils = {};

utils.addRemoveClass = function(data) {
    let clickElement = data.clickElement;
    $(data.addClassElement).addClass(data.addClass);
    $(data.removeClassElement).removeClass(data.removeClass);
};

// 种cookie 
// name 名字、value 值、 time 多长时间失效(以天计算)、path 作用路径
utils.setCookie = function(name, value, time, path) {
    let cookieTime = time || 1;
    let date = new Date();
    let cookiePath = path || '/';
    date.setTime(date.getTime() + time * 24 * 60 * 60 * 1000);// 过期时间
    let overdueTime = date.toGMTString();
    document.cookie = name + '=' + escape(value) + ';path=' + cookiePath + ';expires=' + overdueTime;
};

// 读取cookie
utils.getCookie = function(name) {
    let reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)');// 找cookie的正则表达式
    let cookieValue = '';
    if(cookieValue = document.cookie.match(reg)){
        return unescape(cookieValue[2]); 
    }
    else {
        return null; 
    }
};

// 删除cookie
utils.deleteCookie = function (name, path, domain) {
    let date = new Date(); 
    date.setTime(date.getTime() - 1); 
    let deleteCookie = utils.getCookie(name);
    if(deleteCookie != null) {
        document.cookie = name + '='
        + ((path) ? ';path=' + path : ';path=/')
        + ((domain) ? ';domain=' + domain : '')
        + ';expires=' + date.toGMTString(); 
    }
}
utils.transJobInfo = {
    'fullTime': '全职',
    'internship': '实习生',
    'college': '专科及以上',
    'bachelor': '本科及以上',
    'master': '硕士研究生及以上',
    'doctor': '博士研究生及以上',
    'male': '男',
    'female': '女',
    'unread': 'HR未查看',
    'read': 'HR已查看',
    'unsuited': '不合适',
    'face': '通知面试',
    'write': '通知笔试',
    'offer': '签发offer'
}
module.exports = utils;
