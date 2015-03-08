/*
* This jQuery plugin verifies that all text fields within the selector
* are of at least the given length. If it is valid, then it return true.
* Otherwise it returns false and flashes an error message.
*/

var VALIDATION_IS_RUNNING = 'validateTextFieldLengthIsRunning';

$.fn.validateTextFieldLength = function(length) {
    var self          = this,
        text          = self.val(),
        textLength    = (text && text.length) || 0,
        isValidLength = textLength >= length && !self.data(VALIDATION_IS_RUNNING);
        
    if (!isValidLength) {
        self.data(VALIDATION_IS_RUNNING, true);
        var originalBackgroundColor = self.css('background-color');
        !self.data('originalBackgroundColor') && self.data('originalBackgroundColor', originalBackgroundColor);
        originalBackgroundColor = self.data('originalBackgroundColor');

        self.stop(true).val('')
            .animate({ backgroundColor: '#8B0000'}, 250)
            .delay(250)
            .animate({ backgroundColor: originalBackgroundColor }, 400, function() {
                self.val(text).data(VALIDATION_IS_RUNNING, false);
            });
    } 
    return isValidLength;
};