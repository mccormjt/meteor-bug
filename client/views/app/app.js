var self;
var OPEN_USERS_PANE_CLASS = 'shift-left';

Template.app.rendered = function() {
  self = this;
  self.mainApp        = this.$('.app');
  self.usersPane      = this.$('.users-pane'),
  self.mainCoverPane  = this.$('.main-cover-pane');
  HashChanger.listenFor('contributors', openUsersPane, closeUsersPane);
};

Template.app.events({
  'click .users': HashChanger.hashSetterFnFor('contributors'),
  'click .main-cover-pane': HashChanger.clearHash
});


function openUsersPane() {
  self.mainApp.addClass(OPEN_USERS_PANE_CLASS);
  self.mainCoverPane.fadeIn(300);
  self.usersPane.fadeIn(300);
}

function closeUsersPane() {
  self.mainApp.removeClass(OPEN_USERS_PANE_CLASS);
  self.mainCoverPane.fadeOut(300);
  self.usersPane.fadeOut(500);
}