Accounts.config({
  sendVerificationEmail: false,
  loginExpirationInDays: null
});

if (Meteor.isServer) {
  Meteor.methods({
    createTempUser: createTempUser
  });
}

Meteor.methods({
  setUserCloud:         setUserCloud,
  upsertUserSongVote:   upsertUserSongVote,
  updateUsername:       updateUsername
});


if (Meteor.isServer) {
  Accounts.onCreateUser(function mergeTempProfileWithNew(options, user) {
    var hasLoggedInBefore = user.profile && user.profile.hasLoggedInBefore,
        isOauth = user.services && (user.services.facebook || user.services.twitter);
console.log('HERE', options, '!!!!!!!!!!!!', user);
    user.profile = user.profile || { hasLoggedInBefore: false, songVotes: {} };
    if (!hasLoggedInBefore && isOauth) {
      var tempUser      = Meteor.user();
      var mergedProfile = _.extend(user.profile, options.profile || {}, tempUser.profile);
      user._id          = tempUser._id;
      user.username     = tempUser.username;
      user.profile      = mergedProfile;
      user.profile.hasLoggedInBefore = true;
      Meteor.users.remove(tempUser._id);
    }
    return user;
  });
}


Meteor.users.isValidUsername = function(username) {
  return username != Meteor.user().username && username.length >= 4;
}


function setUserCloud(cloudId) {
  check(cloudId, String);
  setUserProfileProperty(Meteor.userId(), 'currentCloudId', cloudId);
}


function upsertUserSongVote(song, vote) {
  var songVoteProperty = 'songVotes.' + song.guid;
  var songVote = { songName: song.songName, artistName: song.artistName, 
                      groovesharkSongId: song.groovesharkSongId, vote: vote };
  setUserProfileProperty(Meteor.userId(), songVoteProperty, songVote);
}


function setUserProfileProperty(userId, propName, propVal) {
  check(userId,   String);
  check(propName, String);

  var property = {};
  property['profile.' + propName] = propVal;
  Meteor.users.update({ _id: userId }, { $set: property });
}


function createTempUser() {
  var uniqueName  = uniqueNamePair(),
      password    = randString(),
      credentials = { email: uniqueName, password: password },
      userFields  = _.extend(credentials, { username: uniqueName });
  Accounts.createUser(userFields);
  return credentials;
}


function updateUsername(name) {
  check(name, String);
  if (!Meteor.users.isValidUsername(name)) return;
  name = name.replace(/\s+/g, '-');
  var uniqueName = getUniqueUsernameFrom(name);
  var userId = Meteor.userId();
  Meteor.users.update(userId, { $set: { username: uniqueName } });
  CloudUsers.update({ cloudId: Meteor.user().profile.currentCloudId, userId: userId }, { $set: { username: uniqueName } });
  return uniqueName;
}


function uniqueNamePair() {
  var words = ['happy', 'joe', 'party', 'crazy', 'fight', 'black', 'red', 'white', 'joker', 'batman', 'freak', 
              'dancer', 'french', 'american', 'snow', 'club', 'rave', 'runner', 'jesus', 'jack', 'bam', 'viva',
              'super', 'flower', 'dog', 'cat', 'frog', 'fish', 'dolphin', 'butterfly', 'bull', 'dark', 'samon', 
              'champ', 'boom', 'jumper', 'fly', 'spinner', 'singer', 'rap', 'god', 'rapper', 'rum', 'song', 'bad', 
              'bowl', 'frat', 'star', 'eye', 'mountain', 'strike', 'light', 'slam', 'pow', 'punch', 'drunk', 'boulder',
              'sex', 'feat', 'angel', 'burn', 'ages', 'bomb', 'blade', 'blaze', 'chrome', 'chaos', 'claw', 'jade', 
              'omni', 'shade', 'scar', 'storm', 'steel', 'vortex', 'wing', 'void', 'tornadic', 'xeno', 'plasma', 'zap',
              'fire', 'lightning', 'zoom', 'flash', 'school', 'demon', 'chill', 'ice', 'time', 'radio', 'jammer', 'jam',
              'machine', 'munch', 'stack', 'voice', 'scarlet', 'letter', 'hope', 'sound', 'smooth', 'samon', 'high', 'low'];

  var name = _.sample(words, 2).join('-');
  return getUniqueUsernameFrom(name);
}

function getUniqueUsernameFrom(name) {
  while (usernameExists(name)) name += '_' + randString(3);
  return name;
}

function usernameExists(username) {
  return !! Meteor.users.findOne({ username: username });
}

function randString(length) {
  var length   = length || 12,
      text     = '',
      possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'.split('');
  return _.sample(possible, length).join('');
}