Songs = new Meteor.Collection('songs');
if (Meteor.isServer) { 
  Songs._ensureIndex({ cloudId: 1, guid: 1 }, { unique: true });
  Songs._ensureIndex({ cloudId: 1 });
}

Meteor.methods({
  voteForCloudSong: voteForCloudSong,
  upsertUserSongVotesIntoCloud: upsertUserSongVotesIntoCloud,
  queueSong:   queueSong,
  unqueueSong: unqueueSong,
  skipNowPlayingSong: skipNowPlayingSong
});


Songs.createSongGuid = function(songName, artistName) {
  return (songName + '@' + artistName).replace(/[\. ,:-]+/g, '').toLowerCase();
}


function findOrCreateSong(songName, artistName, groovesharkSongId) {
  check(songName, String);
  check(artistName, String);
  check(groovesharkSongId, Match.OneOf(String, Number));

  var guid = Songs.createSongGuid(songName, artistName);
  var song = findCloudSong(guid);

  if (!song) {
    song = { guid: guid, songName: songName, artistName: artistName, isQueued: false, voteCount: 0, priority: 0,
              timeQueued: null, groovesharkSongId: groovesharkSongId, cloudId: App.cloudId(), userVotes: {} };
    song._id = Songs.insert(song);
  }
  return song;
}


function skipNowPlayingSong() {
  var nowPlayingSongId = App.cloud().nowPlayingSongId;
  if (!nowPlayingSongId) return;
  unqueueSong(nowPlayingSongId);
  Clouds.update({ _id: App.cloudId() }, { $set: { nowPlayingSongId: '' } });
}


function setIsQueued(songId, isQueued, priority, addedByUserId) {
  check(songId, String);
  check(isQueued, Boolean);
  check(addedByUserId, String);
  var songParams = { isQueued: isQueued, addedByUserId: addedByUserId, priority: priority };
  isQueued && _.extend(songParams, { timeQueued: Date.now() });
  Songs.update({ _id: songId }, { $set: songParams });
  Meteor.call('updateCloudActiveness');
}


function queueSong(songName, artistName, groovesharkSongId, priority) {
  var song = findOrCreateSong(songName, artistName, groovesharkSongId);
  voteForCloudSong(song.guid, 1);
  Meteor.call('upsertUserSongVote', song, 1);
  Meteor.call('incNumSongsAddedForCloudUser');
  setIsQueued(song._id, true, priority, Meteor.userId());
}


function unqueueSong(songId) {
  var song = Songs.findOne(songId);
  CloudUsers.update({ userId: song.addedByUserId, cloudId: App.cloudId() }, { $inc: { voteScore: song.voteCount } }) 
  setIsQueued(songId, false, 0, '');
}


function voteForCloudSong(guid, newVote) {
  check(guid, String);
  check(newVote, Match.OneOf(1, 0, -1));

  var song              = findCloudSong(guid),
      usersLastVote     = usersVoteFromSong(song),
      hasNotChangedVote = usersLastVote == newVote;
  if (hasNotChangedVote) return;

  var userVote     = {},
      adjustedVote = { voteCount: switchedVoteVal(usersLastVote, newVote) },
      songQuery    = { cloudId: App.cloudId(), guid: guid };

  userVote['userVotes.' + Meteor.userId()] = newVote;
  Songs.update(songQuery, { $set: userVote, $inc: adjustedVote });
}


function upsertUserSongVotesIntoCloud() {
  _.each(App.userSongVotes(), function(song) {
    var cloudSong = findOrCreateSong(song.songName, song.artistName, song.groovesharkSongId);
    voteForCloudSong(cloudSong.guid, song.vote);
  });
}


function usersVoteFromSong(song) {
  return song.userVotes[Meteor.userId()] || 0;
}


function findCloudSong(guid) {
  return Songs.findOne({ cloudId: App.cloudId(), guid: guid });
}


function switchedVoteVal(oldVoteVal, newVoteVal) {
  return (-1 * oldVoteVal) + newVoteVal;
}