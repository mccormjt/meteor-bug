Accounts.config({
  sendVerificationEmail: false,
  loginExpirationInDays: null
});

if (Meteor.isServer) {
  Meteor.methods({
    createTempUser: createTempUser,
  });
}

Meteor.methods({
  setUserCloud: setUserCloud,
  upsertUserSongVote: upsertUserSongVote
});


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
      userFields  = _.extend(credentials, { username: uniqueName, profile: { isTemp: true, songVotes: {} } });
  Accounts.createUser(userFields);
  return credentials;
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