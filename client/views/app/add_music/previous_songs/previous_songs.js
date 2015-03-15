var self,
    ACTIVE_CLASS = 'active';

Template.previousSongs.rendered = function() {
    self = this;
    self.nameSortOption    = self.$('.sort-options span:first-child');
    self.artistSortOption  = self.$('.sort-options span:last-child');
    self.nameSortedSongs   = self.$('.name-sorted-songs');
    self.artistSortedSongs = self.$('.artist-sorted-songs');
};

Template.previousSongs.helpers({
    isActiveClass:    isActiveClass,
    nameSortedSongs:  getNameSortedUserSongs
});

Template.previousSongs.events({
    'click .sort-options span:not(.active)': toggleSortOption
});

function isActiveClass() {
    return $('.previous-songs-mode').hasClass(ACTIVE_CLASS) && ACTIVE_CLASS;
}

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