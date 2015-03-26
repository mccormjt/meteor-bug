CloudUsers = new Meteor.Collection('cloudUsers');

if (Meteor.isServer) { 
    CloudUsers._ensureIndex({ cloudId: 1, userId: 1 }, { unique: true });
    CloudUsers._ensureIndex({ cloudId: 1 });

    Meteor.methods({
        switchIntoAccountFrom: switchIntoAccountFrom
    });
}

Meteor.methods({
    ensureCloudUser:                ensureCloudUser,
    setCloudUserProperty:           setCloudUserProperty,
    incNumSongsAddedForCloudUser:   incNumSongsAddedForCloudUser
});


CloudUsers.prefixedKarma = function(karma) {
    var prefix = karma > 0 ? '+' : '';
    return prefix + karma;
};


function ensureCloudUser(isOwner, cloudId) {
    cloudId = cloudId || App.cloudId();
    check(cloudId, String);
    
    var user        = Meteor.user(),
        query       = getCloudUserQuery(user._id, cloudId),
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
    var hasChangedUsers = fromUserId && Meteor.userId() != fromUserId,
        isRealUserLogin = !Meteor.user().profile.isTempUser;

    if (hasChangedUsers) {
        var fromUser      = Meteor.users.findOne(fromUserId),
            fromCloudUser = CloudUsers.findOne(getCloudUserQuery(fromUserId)),
            toUser        = Meteor.user(),
            toUserProfile = toUser.profile;

        removeUserFromCloud(fromUserId);
        ensureCloudUser(false);
        copyCloudUserMetaDataFrom(fromCloudUser);

        if (isRealUserLogin) {
            Meteor.call('extendUserFrom', fromUser);
            Songs.chownUserSongsAndVotes(fromUserId, toUser._id);
        } else {
            Songs.removeUserSongsAndVotes(fromUserId);
        }
    }
}

function copyCloudUserMetaDataFrom(fromCloudUser) {
    var metaData      = _.omit(fromCloudUser, '_id', 'userId', 'cloudId');
    var toCloudUser   = CloudUsers.findOne(getCloudUserQuery());
    metaData.username = toCloudUser.username || metaData.username;
    metaData.isOwner && Clouds.update(App.cloudId(), { $set: { createdByUserId: toCloudUser.userId } });
    CloudUsers.update(toCloudUser._id, { $set: metaData });
}

function removeUserFromCloud(userId) {
    CloudUsers.remove(getCloudUserQuery(userId));
    var user = Meteor.users.findOne(userId);
    user && user.profile.isTempUser && Meteor.users.remove(userId);
}

function getCloudUserQuery(userId, cloudId) {
    userId  =  userId || Meteor.userId(),
    cloudId = cloudId || App.cloudId();
    return { userId: userId, cloudId: cloudId };
}