import { Meteor } from 'meteor/meteor';

Meteor.startup(() => {
  // code to run on server at startup
});

Meteor.publish('JobList', function() {
  return JobList.find();
});

Meteor.publish('CorporateUsers', function() {
  return CorporateUsers.find();
});