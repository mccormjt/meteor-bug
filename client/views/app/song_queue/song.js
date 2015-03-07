var ACTIVE_VOTE_CLASS = 'active';

Template.song.helpers({
    addedByUsername:     addedByUsername,
    activeVoteClassFor:  activeVoteClassFor,
    voteCount:           getVoteCount
});

Template.song.events({
    'click .upvote, click .downvote': voteForCloudSong
});


function addedByUsername() {
    var cloudUser = CloudUsers.findOne({ userId: this.addedByUserId });
    if (cloudUser) return cloudUser.username;
}

function voteForCloudSong(event) {
    var voteChoice = $(event.target),
        alreadySelectedVote = voteChoice.hasClass(ACTIVE_VOTE_CLASS),
        isUpvote = voteChoice.hasClass('upvote'),
        voteVal  = alreadySelectedVote ? 0 : (isUpvote ? 1 : -1);
    Meteor.call('voteForCloudSong', this.guid, voteVal);
    Meteor.call('upsertUserSongVote', this, voteVal);
}

function activeVoteClassFor(voteVal) {
    var song = findSong(this.guid);
    return song && song.userVotes[Meteor.userId()] == voteVal && ACTIVE_VOTE_CLASS;
}

function getVoteCount() {
    return Songs.voteCountFor(this);
}

function findSong(guid) {
    return Songs.findOne({ guid: guid });
}