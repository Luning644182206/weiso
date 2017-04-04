/**
  * @file: WeiSo后台成功提示
  * @author: luning@bjutra.com
  * @date: 2017.03.23 11:14
  *
*/

Success = new Mongo.Collection(null);

throwSuccess = function(message) {
  Success.insert({message: message});
};