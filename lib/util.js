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
    
    self.log = self.wrapMeteorMethod('log');
}