var self;
    paneShiftPercent = '415px',
    animateTime      = 300,
    isMenuPaneOpen   = false,
    isUsersPaneOpen  = false;

Template.app.created = function() {
    self = this;
    HashChanger.listenFor('menu', openMenuPane, closeMenuPane);
    HashChanger.listenFor('contributors', openUsersPane, closeUsersPane);
}

Template.app.rendered = function() {
    self.mainApp        = this.$('.app');
    self.menuPane       = this.$('.menu-pane'),
    self.usersPane      = this.$('.users-pane'),
    self.mainCoverPane  = this.$('.main-cover-pane');

    var swipeSelector = '.song-queue, .menu-pane, .users-pane, .main-cover-pane';
    HashChanger.clearHash();
    $(document).on('swipeleft',  swipeSelector,  shiftAppRight);
    $(document).on('swiperight', swipeSelector,  shiftAppLeft);
};

Template.app.destroyed = function() {
    HashChanger.stopListeningFor('menu');
    HashChanger.stopListeningFor('contributors');
    $(document).off('swipeleft swiperight');
}

Template.app.events({
    'click .hamburger':         HashChanger.hashSetterFnFor('menu'),
    'click .users':             HashChanger.hashSetterFnFor('contributors'),
    'click .main-cover-pane':   HashChanger.clearHash
});

function openMenuPane() {
    isMenuPaneOpen = true;
    toggleAppPane(self.menuPane, paneShiftPercent, 'fadeIn');
}

function openUsersPane() {
    isUsersPaneOpen = true;
    toggleAppPane(self.usersPane, '-' + paneShiftPercent, 'fadeIn');
}

function closeMenuPane() {
    isMenuPaneOpen = false;
    toggleAppPane(self.menuPane, '0', 'fadeOut');
}

function closeUsersPane() {
    isUsersPaneOpen = false;
    toggleAppPane(self.usersPane, '0', 'fadeOut');
}

function toggleAppPane(pane, shiftAppTo, fadeDirection) {
    self.mainApp.velocity('finish').velocity({ marginLeft: shiftAppTo }, { duration: animateTime, easing: 'ease' });
    self.mainCoverPane.add(pane).velocity('finish').velocity(fadeDirection, { duration: animateTime, easing: 'ease' });
}

function shiftAppLeft() {
    if (isUsersPaneOpen) {
        HashChanger.clearHash();
    } else if (!isMenuPaneOpen) {
         HashChanger.hashSetterFnFor('menu')();
    }
}

function shiftAppRight() {
    if (isMenuPaneOpen) {
        HashChanger.clearHash();
    } else if (!isUsersPaneOpen) {
        HashChanger.hashSetterFnFor('contributors')();
    }
}