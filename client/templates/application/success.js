/**
  * @file: success方法
  * @author: luning@bjutra.com
  * @date: 2017.04.03 20:47
  *
*/

Template.success.helpers({
  success: function() {
    return Success.find();
  }
});

// 一旦模板在浏览器中渲染完毕，onRendered 回调函数被触发
Template.successInfo.onRendered(function() {
  var successInfo = this.data;
  Meteor.setTimeout(function () {
    Success.remove(successInfo._id);
  }, 3000);
});