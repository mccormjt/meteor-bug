Migrations.add({
  version: 3,
  name: 'Add priority field to songs',

  up: function() {
    Songs.update({}, { $set: { priority: 1 } }, { multi: true });
  },

  down: function() {
    Songs.update({}, { $unset: { priority: '' } }, { multi: true });
  }
});