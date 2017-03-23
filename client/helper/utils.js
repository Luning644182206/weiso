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

module.exports = utils;
