var self,
    EDITING_NAME_CLASS = 'editing';

Template.displayName.rendered = function() {
    self = this;
    self.displayNameHolder = self.$('.display-name-holder');
    self.displayName       = self.$('input', self.displayNameHolder);
    self.autorun(updateDisplayNameInputField);
    setupDisplayNameTypeWatch();
};

Template.displayName.events({
    'focus input': startEditingDisplayName,
    'blur  input': stopEditingDisplayName,
    'keyup input': Util.stopEventPropagation
});


function setupDisplayNameTypeWatch() {
    self.displayName.typeWatch({
        callback: toggleIsValidUsernameClass,
        wait: 200,
        captureLength: 0
    });

    function toggleIsValidUsernameClass() {
        var isValidUsernameFormat = Meteor.users.isValidUsernameFormat(self.displayName.val());
        self.displayNameHolder.toggleClass('invalid', !isValidUsernameFormat);
    }
}

function startEditingDisplayName() {
    self.displayNameHolder.addClass(EDITING_NAME_CLASS);
}

function stopEditingDisplayName() {
    var username      = self.displayName.val().trim(),
        isValidFormat = Meteor.users.isValidUsernameFormat(username),
        isValidUpdate = isValidFormat && username != getCurrentUsername();

    self.displayNameHolder.removeClass(EDITING_NAME_CLASS + ' invalid');

    if (isValidUpdate) {
        Meteor.call('updateUsername', username);
        self.displayNameHolder.addClass('saving');
        clearTimeout(self.savingTimer);
        self.savingTimer = setTimeout(function() {
            self.displayNameHolder.removeClass('saving');
        }, 1500);
    } else {
        self.displayName.val(getCurrentUsername());
    }
}

function updateDisplayNameInputField() {
    var username           = getCurrentUsername(),
        userNameHasChanged = username != self.displayName.val(),
        allowedToUpdate    = userNameHasChanged && !self.displayNameHolder.hasClass(EDITING_NAME_CLASS);

    allowedToUpdate && self.displayName.val(username);
}

function getCurrentUsername() {
    return Meteor.user() && Meteor.user().username;
}