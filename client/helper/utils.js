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

// 种cookie name 名字、value 值、 time 多长时间失效(以天计算)、path 作用路径
utils.setCookie = function(name, value, time, path) {
    let cookieTime = time || 1;
    let date = new Date();
    let cookiePath = path || '/';
    date.setTime(date.getTime() + time * 24 * 60 * 60 * 1000);// 过期时间
    let overdueTime = date.toGMTString();
    // exp.setTime(exp.getTime() + Days*24*60*60*1000); 
    document.cookie = name + '=' + escape(value) + ';path=' + cookiePath + ';expires=' + overdueTime;
};

module.exports = utils;
