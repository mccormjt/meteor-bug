CloudUsers = new Meteor.Collection('cloudUsers');

if (Meteor.isServer) { 
    CloudUsers._ensureIndex({ cloudId: 1, userId: 1 }, { unique: true });
    CloudUsers._ensureIndex({ cloudId: 1 });
}

Meteor.methods({
    ensureCloudUser:                ensureCloudUser,
    setCloudUserProperty:           setCloudUserProperty,
    incNumSongsAddedForCloudUser:   incNumSongsAddedForCloudUser,
    switchIntoAccountFrom:          switchIntoAccountFrom
});


CloudUsers.prefixedKarma = function(karma) {
    var prefix = karma > 0 ? '+' : '';
    return prefix + karma;
};


function ensureCloudUser(isOwner, cloudId) {
    cloudId = cloudId || App.cloudId();
    check(cloudId, String);
    var user        = Meteor.user(),
        query       = { userId: user._id, cloudId: cloudId },
        cloudUser   = CloudUsers.findOne(query);

    if (cloudUser) {
        return cloudUser._id;
     } else {
        var isOwner  = !! isOwner,
            userData = _.extend(query, 
                  { isOwner: isOwner, isAdmin: isOwner, isOutput: isOwner, isBanned: false, 
                    voteScore: 0, numSongsAdded: 0, userId: user._id, username: user.username, 
                    engagements: {}, lastActiveAt: Date.now() });
        return CloudUsers.insert(userData);
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

function incNumSongsAddedForCloudUser() {
    CloudUsers.update({ userId: Meteor.userId(), cloudId: App.cloudId() }, { $inc: { numSongsAdded: 1 } });
}


function switchIntoAccountFrom(fromUserId) {
    var hasChangedUsers = fromUserId && Meteor.userId() != fromUserId;
    if (hasChangedUsers) {
        copyCloudUserDataFrom(fromUserId);
        removeUserFromCloud(fromUserId, true);
    }
}

function copyCloudUserDataFrom(fromUserId) {
    var fromCloudUser = CloudUsers.findOne({ cloudId: App.cloudId(), userId: fromUserId });
    if (!fromCloudUser) return;

    var metaData        = _.omit(fromCloudUser, '_id', 'userId', 'username', 'cloudId'),
        toCloudUserId   = ensureCloudUser(false, fromCloudUser.cloudId);

    CloudUsers.update(toCloudUserId, { $set: metaData });
}

function removeUserFromCloud(userId, shouldRemoveCloudUserEntry) {
    var user = Meteor.users.findOne(userId);
    if (!user) return;

    var cloudId        = user.profile.currentCloudId,
        userVote       = {},
        cloudUserQuery = { cloudId: cloudId, userId: userId };

    Songs.remove({ cloudId: cloudId, addedByUserId: userId });
    userVote['userVotes.' + userId] = '';
    Songs.update({ cloudId: cloudId }, { $unset: userVote }, { multi: true });
    user.isTempUser && Meteor.users.remove(userId);

    if (shouldRemoveCloudUserEntry) {
        CloudUsers.remove(cloudUserQuery);
    } else {
        CloudUsers.update(cloudUserQuery, { voteScore: 0 });
    }
}