var self,
    EDITING_NAME_CLASS = 'editing';

Template.displayName.rendered = function() {
    self = this;
    self.displayNameHolder = self.$('.display-name-holder');
    self.displayName       = self.$('input', self.displayNameHolder);
};

Template.displayName.events({
    'focus input': startEditingDisplayName,
    'blur  input':  stopEditingDisplayName
});

function startEditingDisplayName() {
    self.displayNameHolder.addClass(EDITING_NAME_CLASS);
}

function stopEditingDisplayName() {
    self.displayNameHolder.removeClass(EDITING_NAME_CLASS);
}