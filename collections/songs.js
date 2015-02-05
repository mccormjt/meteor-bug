Songs = new Meteor.Collection('songs');
if (Meteor.isServer) { 
  Songs._ensureIndex({ cloudId: 1, groovesharkSongId: 1 }, { unique: true });
  Songs._ensureIndex({ cloudId: 1 });
  Songs._ensureIndex({ _id: 1 });
}

Meteor.methods({
  voteForSong: voteForSong,
  upsertUserSongVotesIntoCloud: upsertUserSongVotesIntoCloud,
  addSongToQueue: addSongToQueue,
  queueSong: queueSong,
  unqueueSong: unqueueSong,
  skipNowPlayingSong: skipNowPlayingSong
});


function findOrCreateSong(songName, artistName, groovesharkSongId) {
  check(songName, String);
  check(artistName, String);
  check(groovesharkSongId, Match.OneOf(String, Number));

  var song = findCloudSong(groovesharkSongId);
  if (!song) {
    song = { songName: songName, artistName: artistName, isQueued: false, voteCount: 0, timeQueued: null,
              groovesharkSongId: groovesharkSongId, cloudId: App.cloudId(), userVotes: {} };
    song._id = Songs.insert(song);
  }
  return song;
}


function addSongToQueue(songName, artistName, groovesharkSongId) {
  var song = findOrCreateSong(songName, artistName, groovesharkSongId);
  voteForSong(groovesharkSongId, 1);
  Meteor.call('upsertUserSongVote', songName, artistName, groovesharkSongId, 1);
  queueSong(song._id);
}

function skipNowPlayingSong() {
  var nowPlayingSongId = App.cloud().nowPlayingSongId;
  if (!nowPlayingSongId) return;
  unqueueSong(nowPlayingSongId);
  Clouds.update({ _id: App.cloudId() }, { $set: { nowPlayingSongId: '' } });
}

function setIsQueued(songId, isQueued, addedByUserId) {
  check(songId, String);
  check(isQueued, Boolean);
  check(addedByUserId, String);
  var songParams = { isQueued: isQueued, addedByUserId: addedByUserId };
  isQueued && _.extend(songParams, { timeQueued: Date.now() });
  Songs.update({ _id: songId }, { $set: songParams });
  Meteor.call('updateCloudActiveness');
}


function queueSong(songId) { 
  setIsQueued(songId, true, Meteor.userId());
}


function unqueueSong(songId) {
  var song = Songs.findOne(songId);
  CloudUsers.update({ userId: song.addedByUserId, cloudId: App.cloudId() }, { $inc: { voteScore: song.voteCount } }) 
  setIsQueued(songId, false, '');
}


function checkSongVoteParams(groovesharkSongId, vote) {
  check(groovesharkSongId, Match.OneOf(String, Number));
  check(vote, Match.OneOf(1, 0, -1));
  check(App.cloudId(), String);
}


function voteForSong(groovesharkSongId, newVote) {
  checkSongVoteParams(groovesharkSongId, newVote);
  var song              = findCloudSong(groovesharkSongId),
      usersLastVote     = usersVoteFromSong(song),
      hasNotChangedVote = usersLastVote == newVote;
  if (hasNotChangedVote) return;

  var userVote     = {},
      adjustedVote = { voteCount: switchedVoteVal(usersLastVote, newVote) },
      songQuery    = { cloudId: App.cloudId(), groovesharkSongId: groovesharkSongId };

  userVote['userVotes.' + Meteor.userId()] = newVote;
  Songs.update(songQuery, { $set: userVote, $inc: adjustedVote });
}


function upsertUserSongVotesIntoCloud() {
  var userSongVotes = _.pairs(App.userSongVotes());
  _.each(userSongVotes, function(vote) {
    var song = vote[1],
        groovesharkSongId = vote[0],
        cloudSong = findOrCreateSong(song.songName, song.artistName, groovesharkSongId);
    voteForSong(groovesharkSongId, song.vote);
  });
}


function usersVoteFromSong(song) {
  return song.userVotes[Meteor.userId()] || 0;
}


function findCloudSong(groovesharkSongId) {
  return Songs.findOne({ cloudId: App.cloudId(), groovesharkSongId: groovesharkSongId });
}


function switchedVoteVal(oldVoteVal, newVoteVal) {
  return (-1 * oldVoteVal) + newVoteVal;
}