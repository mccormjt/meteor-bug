var self;

Template.feedback.rendered = function() {
    self = this;
    self.form     = self.$('form');
    self.subject  = self.$('#subject', self.form);
    self.message  = self.$('#message', self.form);
    self.thankyou = self.$('.thankyou');
};

Template.feedback.events({
    'submit form': submitFeedback
});

function submitFeedback() {
  if (!(self.subject.validateTextFieldLength(1) && self.message.validateTextFieldLength(1))) return false;
  Meteor.call('sendFeedbackEmail', self.subject.val() ,self.message.val());
  swapFadeElements(self.form, self.thankyou);
  setTimeout(resetForm, 2200);
  return false; 
}

function resetForm() {
    self.form[0].reset();
    swapFadeElements(self.thankyou, self.form);
}

function swapFadeElements(fadeOut, fadeIn) {
    fadeOut.velocity('fadeOut', { duration: 250, complete: function() {
        fadeIn.velocity('fadeIn', { duration: 250 });
    }});
}