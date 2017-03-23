/**
  * @file: WeiSo动态页面路由
  * @author: luning@bjutra.com
  * @date: 2017.03.05 15:18
  *
*/

// 使用 layout 模板作为默认布局
Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading',
  // 数据请求延迟 只在第一次加载的时候使用
  // waitOn: function() { return Meteor.subscribe('posts'); }
});

// 根路径 / URL 映射到 signIn 模板
Router.route('/', {name: 'signIn'});

// Router.route('/posts/:_id', {
//   name: 'postPage'
// });

// 页面路由设置
Router.route('/signup', {name: 'signUp'});