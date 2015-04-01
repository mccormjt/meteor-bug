Meteor.publish('lock', function() {
    return Lock.find();
});

Meteor.publish('users', function(cloudId) {
    return Meteor.users.find({ cloudId: cloudId });
});