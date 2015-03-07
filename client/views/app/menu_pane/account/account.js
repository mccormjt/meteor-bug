var self,
    numSongsQueued  = new ReactiveVar(0),
    karma           = new ReactiveVar(0),
    upvotes         = new ReactiveVar(0),
    downvotes       = new ReactiveVar(0);


Template.account.rendered = function() {
    self = this;
    self.autorun(updateAccountStats);
};  

Template.account.helpers({
    name:            getAccountHoldersName,
    numSongsQueued:  getNumSongsQueued,
    prefixedKarma:   getPrefixedKarma,
    upvotes:         getUpvotes,
    downvotes:       getDownvotes
});

Template.account.events({
    'click button': logoutOfCloud
});

function logoutOfCloud() {
    App.stopEnsuringUser();
    Meteor.logout(App.startEnsuringUser);
}

function getAccountHoldersName() {
    return Meteor.user().profile.name;
}

function getNumSongsQueued() {
    return numSongsQueued.get();
}

function getPrefixedKarma() {
    return CloudUsers.prefixedKarma(karma.get());
}

function getUpvotes() {
    return upvotes.get();
}

function getDownvotes() {
    return downvotes.get();
}

function updateAccountStats() {
    var cloudUser = App.cloudUser();
    if (!cloudUser) return;

    var karmaTotal      = cloudUser.voteScore,
        upvotesTotal    = 0,
        downvotesTotal  = 0,
        songs           = Songs.find({ isQueued: true, addedByUserId: cloudUser.userId }),
        voteSplit;

    songs.forEach(function(song) {
        voteSplit = _.countBy(_.values(song.userVotes), function(num) { return num });
        upvotesTotal    += voteSplit['1']  || 0;
        downvotesTotal  += voteSplit['-1'] || 0;
    });
    karmaTotal += upvotesTotal - downvotesTotal;

    numSongsQueued.set(songs.count());
    karma.set(karmaTotal);
    upvotes.set(upvotesTotal);
    downvotes.set(downvotesTotal);
}