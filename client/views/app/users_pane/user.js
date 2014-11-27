var lastOpenedUser,
    PERMISSION_ACTIVE_CLASS = 'active',
    SHOW_USER_PERMISSIONS_CLASS = 'show-user-permissions';

Template.user.rendered = function() {
  this.user = this.$('.user');
};

Template.user.events({
  'click .user-permissions i': toggleActiveClass,
  'click .fa-info-circle': toggleUserPermissionsPane
});

function toggleActiveClass(event) {
  $(event.target).toggleClass(PERMISSION_ACTIVE_CLASS);
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