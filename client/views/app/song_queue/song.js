var ACTIVE_VOTE_CLASS = 'active';

Template.song.helpers({
  addedByUsername: addedByUsername,
  activeVoteClassFor: activeVoteClassFor
});

Template.song.events({
  'click .upvote, click .downvote': voteForSong
});


function addedByUsername() {
  return CloudUsers.findOne({ userId: this.addedByUserId }).username;
}

function voteForSong(event) {
  var voteChoice = $(event.target),
      alreadySelectedVote = voteChoice.hasClass(ACTIVE_VOTE_CLASS),
      isUpvote = voteChoice.hasClass('upvote'),
      voteVal  = alreadySelectedVote ? 0 : (isUpvote ? 1 : -1);
  Meteor.call('voteForSong', this.groovesharkSongId, voteVal);
}

function activeVoteClassFor(voteVal) {
  var songVote = findSong(this.groovesharkSongId);
  return songVote.userVotes[Meteor.userId()] == voteVal && ACTIVE_VOTE_CLASS;
}

function findSong(groovesharkSongId) {
  return Songs.findOne({ groovesharkSongId: groovesharkSongId });
}