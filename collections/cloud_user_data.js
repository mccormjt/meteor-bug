CloudUserData = new Meteor.Collection('cloudUserData');
if (Meteor.isServer) { 
  CloudUserData._ensureIndex({ cloudId: 1, userId: 1 }, { unique: true });
}

Meteor.methods({
  ensureCloudUserData: ensureCloudUserData
});


function ensureCloudUserData(userId, cloudId, isOwner) {
  check(userId, String);
  check(cloudId, String);
  var query    = { userId: userId, cloudId: cloudId },
      exists   = CloudUserData.findOne(query),
      isOwner  = !! isOwner,
      userData = _.extend(query, { isOwner: isOwner, isAdmin: isOwner, isOutput: isOwner, isBanned: false });
  if (!exists) CloudUserData.insert(userData);
}