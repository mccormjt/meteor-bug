Util = new function() {
  var self = this;

  self.log = function() {
    console.log.apply(console, arguments)
  }

  self.hoursToMiliseconds = function(hours) {
    return hours * 60 * 60 * 1000;
  }

  self.wrapMeteorMethod = function() {
    var methodArgs = arguments;
    return function() {
      Meteor.call.apply(methodArgs);
    }
  }
}