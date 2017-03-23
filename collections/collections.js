/**
  * @file: WeiSo collections
  * @author: luning@bjutra.com
  * @date: 2017.03.05 21:17
  *
*/

SecretQuestions = new Mongo.Collection('secretQuestions');// 密保问题
Provinces = new Mongo.Collection('provinces');// 省
Municipalities = new Mongo.Collection('municipalitys');// 市
IndividualUsers = new Mongo.Collection('individualUsers');// 个人用户
CorporateUsers = new Mongo.Collection('corporateUsers');// 企业用户