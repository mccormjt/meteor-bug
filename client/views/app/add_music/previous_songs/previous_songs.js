var self,
    ACTIVE_CLASS = 'active';

Template.previousSongs.rendered = function() {
    if (this.rendered) return;
    self = this;
    self.nameSortOption    = self.$('.sort-options span:first-child');
    self.artistSortOption  = self.$('.sort-options span:last-child');
    self.nameSortedSongs   = self.$('.name-sorted-songs');
    self.artistSortedSongs = self.$('.artist-sorted-songs');
};

Template.previousSongs.helpers({
    nameSortedSongs: getNameSortedUserSongs
});

Template.previousSongs.events({
    'click .sort-options span:not(.active)': toggleSortOption
});


function getNameSortedUserSongs() {
    return _.sortBy(getUserSongs(), 'songName');
}

function getArtistSortedUserSongs() {
  
}

function getUserSongs() {
    return _.values(Meteor.user().profile.songVotes);
}

function toggleSortOption() {
    $('.sort-options span, .sorted-songs > div').toggleClass(ACTIVE_CLASS);
}