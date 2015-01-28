Util = new function() {
  var self = this;

  Meteor.methods({
    log: consoleLog
  });

  function consoleLog() {
    console.log.apply(console, arguments);
  }

  self.hoursToMiliseconds = function(hours) {
    return hours * 60 * 60 * 1000;
  };

  self.wrapMeteorMethod = function() {
    var methodArgs = _.toArray(arguments);
    return function() {
      var execArgs = methodArgs.concat(_.toArray(arguments));
      Meteor.call.apply(Meteor, execArgs);
    }
  };

  self.log = self.wrapMeteorMethod('log');
}