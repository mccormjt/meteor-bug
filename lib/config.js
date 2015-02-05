if (Meteor.isServer) {
  // Allows you to ConsoleMe.subscribe() or unsubscribe() on client to start receiveing all server console.log() calls
  // Meant for debugging purposes
  // SHOULD NOT BE ENABLED IN PRODUCTION
  ConsoleMe.enabled = true;
}