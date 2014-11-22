Lock = new Meteor.Collection('lock');

Meteor.methods({
  lock:   function() { setLockState(true)  },
  unlock: function() { setLockState(false) },
  isLocked: isLocked
});

function setLockState(isLocked) {
  Lock.upsert({}, { isLocked: isLocked });
}

function isLocked() {
  return Lock.findOne().isLocked;
}