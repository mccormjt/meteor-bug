var self;
var OPEN_USERS_PANE_CLASS = 'shift-left';

Template.app.rendered = function() {
  self = this;
  self.mainApp = this.$('.app');
  self.usersPane = this.$('.users-pane');
};

Template.app.events({
  'click .users': toggleUsersPane
});


function toggleUsersPane() {
  self.mainApp.toggleClass(OPEN_USERS_PANE_CLASS);
}