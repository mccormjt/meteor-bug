CloudUsers = new Meteor.Collection('cloudUsers');

if (Meteor.isServer) { 
  CloudUsers._ensureIndex({ cloudId: 1, userId: 1 }, { unique: true });
  CloudUsers._ensureIndex({ cloudId: 1 });
}

Meteor.methods({
  ensureCloudUser: ensureCloudUser,
  setCloudUserProperty:   setCloudUserProperty
});


function ensureCloudUser(isOwner, cloudId) {
  cloudId = cloudId || App.cloudId();
  check(cloudId, String);
  var user     = Meteor.user(),
      query    = { userId: user._id, cloudId: cloudId },
      exists   = CloudUsers.findOne(query);

  if (!exists) {
    var isOwner  = !! isOwner,
        userData = _.extend(query, 
          { isOwner: isOwner, isAdmin: isOwner, isOutput: isOwner, isBanned: false, 
            voteScore: 0, userId: user._id, username: user.username, engagements: {}, lastActiveAt: Date.now() });
    CloudUsers.insert(userData);
  }
}

function setCloudUserProperty(userId, cloudId, propName, propVal) {
  check(userId,   String);
  check(cloudId,  String);
  check(propName, String);

  var property = {};
  property[propName] = propVal;
  CloudUsers.update({ userId: userId, cloudId: cloudId }, { $set: property });
}