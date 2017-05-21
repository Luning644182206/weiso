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
    waitOn: function() { 
        return Meteor.subscribe('JobList'); 
    }
});

// 根路径 / URL 映射到 index 模板
Router.route('/', {name: 'index'});

// 页面路由设置
Router.route('/signup', {name: 'signUp'});
Router.route('/signin', {name: 'signIn'});
Router.route('/success', {name: 'signUpSuccess'});// 注册成功
Router.route('/corporate', {
    name: 'corporate',
    waitOn: function() { 
        return Meteor.subscribe('CorporateUsers'); 
    }
});// 公司账户主页
Router.route('/console', {name: 'console'});// 个人中心
// Router.route('/dealresume', {name: 'dealResume'});// HR处理简历
// 编辑职位
Router.route('/corporate/edit/:_id', {
    name: 'newJob',
    data: function() {
        return this.params._id;
    }
});
// 查看职位
Router.route('/job/:_id', {
    name: 'showJob',
    data: function() {
        return this.params._id;
    }
});
// 处理简历
Router.route('/dealresume/:_id', {
    name: 'dealResume',
    data: function() {
        return this.params._id;
    }
});











// 创建简历
Router.route('/addresume', {name: 'addResume'});