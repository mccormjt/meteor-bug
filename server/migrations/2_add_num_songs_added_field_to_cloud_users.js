Migrations.add({
  version: 2,
  name: 'Add numSongsAdded field to CloudUsers',

  up: function() {
    CloudUsers.update({}, { $set: { numSongsAdded: 0 } }, { multi: true });
  },

  down: function() {
    CloudUsers.update({}, { $unset: { numSongsAdded: '' } }, { multi: true });
  }
});