/**
  * @file: error方法
  * @author: luning@bjutra.com
  * @date: 2017.03.23 13:07
  *
*/

Template.errors.helpers({
  errors: function() {
    return Errors.find();
  }
});

// 一旦模板在浏览器中渲染完毕，onRendered 回调函数被触发
Template.error.onRendered(function() {
  var error = this.data;
  Meteor.setTimeout(function () {
    Errors.remove(error._id);
  }, 3000);
});