var lastOpenedUser,
    PERMISSION_ACTIVE_CLASS = 'active',
    SHOW_USER_PERMISSIONS_CLASS = 'show-user-permissions';

Template.cloudUser.rendered = function() {
  this.user = this.$('.user');
};

Template.cloudUser.helpers({
  userTypeClass:     userTypeClass,
  prefixedKarma:     prefixedKarma,
  canSetOutputClass: function() { return App.isOwner()  && 'can-set' },
  canSetAdminClass:  function() { return canSetAdmin(this.userId)  && 'can-set' },
  canSetBannedClass: function() { return canSetBanned(this.userId) && 'can-set' }
});

Template.cloudUser.events({
  'click .user-details i.fa':        toggleUserPermissionsPane,
  'click .user-permissions .output': makeUserPermissionSetterFn(toggleOutputUserAuthFn, 'isOutput'),
  'click .user-permissions .admin':  makeUserPermissionSetterFn(canSetAdmin,  'isAdmin'),
  'click .user-permissions .ban':    makeUserPermissionSetterFn(canSetBanned, 'isBanned')
});


function prefixedKarma() {
  var prefix = '';
  if (this.karma > 0) prefix = '+';
  return prefix + this.karma;
}

function userTypeClass() {
  if (App.isOwner(this.userId)) {
    var isSelfClass = App.isCurrentUser(this.userId) ? ' is-self' : '';
    return 'fa-user' + isSelfClass;
  }
  else if (App.isCurrentUser(this.userId)) {
    return 'fa-star';
  }
  else if (App.isAdmin()) {
    return 'fa-wrench';
  }
  else {
    return 'fa-info-circle';
  }
}

function toggleUserPermissionsPane(event, template) {
  var user = template.user;
  if (user.hasClass(SHOW_USER_PERMISSIONS_CLASS)) {
    lastOpenedUser = null;
  } else {
    lastOpenedUser && lastOpenedUser.removeClass(SHOW_USER_PERMISSIONS_CLASS);
    lastOpenedUser = user;
  }
  user.toggleClass(SHOW_USER_PERMISSIONS_CLASS);
}

function toggleOutputUserAuthFn(context) {
  var isOwner = App.isOwner(),
      currentOutputUser  = CloudUsers.findOne({ isOutput: true }),
      unsetCurrentOutput = isOwner && currentOutputUser && currentOutputUser.userId != this.userId 

  unsetCurrentOutput && CloudUsers.update({ _id: currentOutputUser._id }, { $set: { isOutput: false } });
  return isOwner;
}

function canSetAdmin(setUserId) {
  return App.isOwner() && !App.isCurrentUser(setUserId);
}

function canSetBanned(setUserId) {
  return App.isAdmin() && !App.isCurrentUser(setUserId) && !App.isOwner(setUserId);
}

function makeUserPermissionSetterFn(authorizedFn, property) {
  return function(event) {
      if (!authorizedFn(this.userId)) return;
      var isActive = ! $(event.target).hasClass(PERMISSION_ACTIVE_CLASS);
      Meteor.call('setCloudUserProperty', this.userId, App.cloudId(), property, isActive);
  }
}