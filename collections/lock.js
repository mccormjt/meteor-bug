Lock = new Meteor.Collection('lock');
if (Meteor.isServer) {
  ensureLock();
}

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

function ensureLock() {
  !Lock.findOne() && setLockState(true);
}