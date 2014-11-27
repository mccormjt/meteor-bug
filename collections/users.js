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
  setCurrentUserCloud: setCurrentUserCloud
});


function setCurrentUserCloud(cloudId) {
  setUserCloud(Meteor.userId(), cloudId);
}


function setUserCloud(userId, cloudId) {
  check(userId,  String);
  check(cloudId, String);
  setUserProfileProperty(userId, 'currentCloudId', cloudId);
}


function setUserProfileProperty(userId, propName, propVal) {
  var property = {};
  property['profile.' + propName] = propVal;
  Meteor.users.update({ _id: userId }, { $set: property });
}


function createTempUser() {
  var uniqueName  = uniqueNamePair(),
      password    = randString(),
      credentials = { email: uniqueName, password: password },
      userFields  = _.extend(credentials, { username: uniqueName, profile: { isTemp: true } });
  Accounts.createUser(userFields);
  return credentials;
}


function uniqueNamePair() {
  var words = ['happy', 'joe', 'party', 'crazy', 'fight', 'black', 'red', 'white', 'joker', 'batman', 'freak', 
                'dancer', 'french', 'american', 'snow', 'club', 'rave', 'runner', 'jesus', 'jack', 'bam', 'viva',
                'super', 'flower', 'dog', 'cat', 'frog', 'fish', 'dolphin', 'butterfly', 'bull', 'dark', 'samon', 
                'champ', 'boom', 'jumper', 'fly', 'spinner', 'singer', 'rap', 'god', 'rapper', 'rum', 'song', 'bad', 'bowl'];

  var name      = _.sample(words, 2).join('-'),
      numOfName = Meteor.users.find({ email: name }).count(),
      suffix    = numOfName ? '-' + (numOfName+1) : '';
  return name + suffix;
}


function randString() {
  var text     = '',
      possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'.split('');
  return _.sample(possible, 12).join('');
}