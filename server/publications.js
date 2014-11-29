Meteor.publish('cloud', function(cloudId) {
  return Clouds.find({ _id: cloudId });
});

Meteor.publish('songQueue', function(cloudId) {
  return Songs.find({ cloudId: cloudId }, { sort: { _id: 1 } });
});

Meteor.publish('lock', function() {
  return Lock.find();
});

Meteor.publish('users', function(cloudId) {
  return Meteor.users.find({ cloudId: cloudId });
});

Meteor.publish('cloudUsers', function(cloudId) {
  return CloudUsers.find({ cloudId: cloudId });
});