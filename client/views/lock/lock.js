Template.lock.helpers({
  lockStateText: function() {
    return isLocked() ? 'Locked' : 'Unlocked';
  },

  btnLockStateClass: function() {
    return isLocked() ? 'btn-danger' : 'btn-success';
  },

  btnActionText: function() {
    return isLocked() ? 'Unlock' : 'Lock';
  }
});

Template.lock.events({
  'click button':       unlock,
  'click .btn-danger':  unlock,
  'click .btn-success': lock
});

function isLocked() {
  return Lock.findOne().isLocked;
}

function lock() {
  Meteor.call('lock')
}

function unlock() {
  Meteor.call('unlock');
}