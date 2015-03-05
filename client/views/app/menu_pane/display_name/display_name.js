var self,
    EDITING_NAME_CLASS = 'editing';

Template.displayName.rendered = function() {
    self = this;
    self.displayNameHolder = self.$('.display-name-holder');
    self.displayName       = self.$('input', self.displayNameHolder);
    resetDisplayNameToLastSaved();
    setupDisplayNameTypeWatch();
};

Template.displayName.events({
    'focus input': startEditingDisplayName,
    'blur  input': stopEditingDisplayName
});


function setupDisplayNameTypeWatch() {
    self.displayName.typeWatch({
        callback: toggleIsValidUsernameClass,
        wait: 200,
        captureLength: 0
    });

    function toggleIsValidUsernameClass() {
        var isValidUsername = Meteor.users.isValidUsername(self.displayName.val());
        self.displayNameHolder.toggleClass('invalid', !isValidUsername);
    }
}

function startEditingDisplayName() {
    self.displayNameHolder.addClass(EDITING_NAME_CLASS);
}

function stopEditingDisplayName() {
    var username = self.displayName.val();
    self.displayNameHolder.removeClass(EDITING_NAME_CLASS + ' invalid');

    if (Meteor.users.isValidUsername(username)) {
        Meteor.call('updateUsername', username, resetDisplayNameToLastSaved);
        self.displayNameHolder.addClass('saving');
        clearTimeout(self.savingTimer);
        self.savingTimer = setTimeout(function() {
            self.displayNameHolder.removeClass('saving');
        }, 1500);
    } else {
        resetDisplayNameToLastSaved();
    }
}

function resetDisplayNameToLastSaved() {
    self.displayName.val(Meteor.user().username);
}