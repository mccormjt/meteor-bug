Util = new function() {
    var self = this;

    Meteor.methods({
        log: consoleLog
    });

    function consoleLog() {
        console.log.apply(console, arguments);
    }

    self.wrapMeteorMethod = function() {
        var methodArgs = _.toArray(arguments);
        return function() {
            var execArgs = methodArgs.concat(_.toArray(arguments));
            return Meteor.call.apply(Meteor, execArgs);
        }
    };

    self.unblockMeteorMethod = function(methodContext) {
        methodContext.unblock && methodContext.unblock.call(methodContext);
    };

    self.log = self.wrapMeteorMethod('log');


    // ========================== CLIENT ONLY ============================

    if (Meteor.isClient) {
        self.stopEventPropagation = function(e) { e.stopPropagation() };

        self.selectText = function(element) {
            var range, selection;
       
            if (document.body.createTextRange) {
                  range = document.body.createTextRange();
                  range.moveToElementText(element);
                  range.select();
            } else if (window.getSelection) {
                  selection = window.getSelection();        
                  range = document.createRange();
                  range.selectNodeContents(element);
                  selection.removeAllRanges();
                  selection.addRange(range);
            }
        };
    }
}