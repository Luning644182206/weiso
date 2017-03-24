/**
  * @file: WeiSo错误提示
  * @author: luning@bjutra.com
  * @date: 2017.03.23 11:14
  *
*/

Errors = new Mongo.Collection(null);

throwError = function(message) {
  Errors.insert({message: message});
};