Songs = new Meteor.Collection('songs');
if (Meteor.isServer) { 
  Songs._ensureIndex({ cloudId: 1, groovesharkSongId: 1 }, { unique: true });
  Songs._ensureIndex({ cloudId: 1 });

  Meteor.methods({
    voteForSong: voteForSong,
    upsertUserSongVotesIntoCloud: upsertUserSongVotesIntoCloud
  });
}

Meteor.methods({

  insertSong: function(songName, artistName, groovesharkSongId) {
    check(songName, String);
    check(artistName, String);
    check(groovesharkSongId, Match.OneOf(String, Number));
    return Songs.insert({ addedByUserId: Meteor.userId(), songName: songName, artistName: artistName,
                          groovesharkSongId: groovesharkSongId, cloudId: App.cloudId(), userVotes: {}, voteCount: 0 });
  },

  removeSong: function(songId) {
    check(songId, String);
    Songs.remove({ _id: songId })
  }
});


function checkSongVoteParams(groovesharkSongId, vote) {
  check(groovesharkSongId, Match.OneOf(String, Number));
  check(vote, Match.OneOf(1, 0, -1));
  check(App.cloudId(), String);
}


function voteForSong(groovesharkSongId, vote) {
  checkSongVoteParams(groovesharkSongId, vote);
  Meteor.call('upsertUserSongVote', groovesharkSongId, vote);
  updateSongVote(groovesharkSongId, vote);
}


function updateSongVote(groovesharkSongId, newVote) {
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
    updateSongVote(vote[0], vote[1]);
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
