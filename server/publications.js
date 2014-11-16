Meteor.publish('cloud', function(id) {
  return Clouds.find({ _id: id });
});