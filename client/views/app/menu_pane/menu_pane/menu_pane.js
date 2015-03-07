var self,
    ACTIVE_TAB_CLASS = 'active';

Template.menuPane.created = function() {
    self = this;
};

Template.menuPane.rendered = function() {
    self.$('li').on('swipeleft swiperight swipe', function(e) {
        e.stopPropagation();
        e.preventDefault();
    });
};

Template.menuPane.helpers({
    isLoggedIn: isLoggedIn
});

Template.menuPane.events({
    'click li > h2': switchToTab
});


function switchToTab (event) {
    var tab        = self.$(event.target).closest('li'),
        header     = $('h2', tab);
        content    = $('> div', tab),
        isSameTab  = (self.currentTabHeader && self.currentTabHeader.text()) == header.text();

    toggleTab(self.currentTabHeader, self.currentTabContent, false);

    if (isSameTab) {
        self.currentTabHeader = self.currentTabContent = null;
    } else {
        toggleTab(header, content, true);
        self.currentTabHeader  = header;
        self.currentTabContent = content;
    }
}

function toggleTab(tab, content, isOpening) {
    if (tab && content) {
        var slideDirection  = isOpening ? 'slideDown' : 'slideUp';
        tab.toggleClass(ACTIVE_TAB_CLASS);
        content.velocity('finish').velocity(slideDirection, { duration: 300 });
    }
}

function isLoggedIn() {
    return Meteor.user() && !Meteor.user().profile.isTempUser;
}