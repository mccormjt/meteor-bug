Migrations.add({
  version: 1,
  name: 'Add engagement and lastActiveAt fields to CloudUsers for analytics',

  up: function() {
    CloudUsers.update({}, { $set: { lastActiveAt: Date.now(),  engagements: {} } }, { multi: true });
  },

  down: function() {
    CloudUsers.update({}, { $unset: { lastActiveAt: '',  engagements: '' } }, { multi: true });
  }
});