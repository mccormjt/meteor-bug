InactiveClouds = new Meteor.Collection('inactiveClouds');

if (Meteor.isServer) {
  Meteor.methhods({
    softDeleteInactiveClouds: softDeleteInactiveClouds
  });
}

function softDeleteInactiveClouds() {
}