var self,
    nameSortedSongs = new ReactiveVar([]),
    ACTIVE_CLASS    = 'active';

Template.previousSongs.rendered = function() {
    self = this;
    self.nameSortOption    = self.$('.sort-options span:first-child');
    self.artistSortOption  = self.$('.sort-options span:last-child');
    self.nameSortedSongs   = self.$('.name-sorted-songs');
    self.artistSortedSongs = self.$('.artist-sorted-songs');
    self.autorun(cacheNameSortedSongs);
};

Template.previousSongs.helpers({
    isActiveClass:        isActiveClass,
    hasAnyPreviousSongs:  hasAnyPreviousSongs,
    nameSortedSongs:      getNameSortedSongs,
    artistSortedSongs:    getArtistSortedSongs
});

Template.previousSongs.events({
    'click .sort-options span:not(.active)': toggleSortOption,
    'click .artist-container h6':            toggleBetweenArtists
});

function isActiveClass() {
    return $('.previous-songs-mode').hasClass(ACTIVE_CLASS) && ACTIVE_CLASS;
}

function hasAnyPreviousSongs() {
    return getNameSortedSongs().length;
}

function getNameSortedSongs() {
    return nameSortedSongs.get();
}

function getArtistSortedSongs() {
    var artistGroupedSongs = _.groupBy(getNameSortedSongs(), 'artistName');
    var artistSortedGroups = _.map(artistGroupedSongs, function(artistSongs, artistName) {
        return { artistName: artistName, artistSongs: artistSongs };
    });
    return _.sortBy(artistSortedGroups, 'artistName');
}

function cacheNameSortedSongs() {
    nameSortedSongs.set(_.sortBy(getUsersUpvotedSongs(), 'songName'));
}

function getUsersUpvotedSongs() {
    return _.filter(Meteor.user().profile.songVotes, function(song) {
        return song.vote == 1;
    });
}

function toggleSortOption() {
    $('.sort-options span, .sorted-songs > div').toggleClass(ACTIVE_CLASS);
}

function toggleBetweenArtists(event) {
    var artistHeader          = $(event.target).closest('h6'),
        artistSongs           = artistHeader.siblings('.artist-songs'),
        isDifferentArtist     = self.lastArtistName != this.artistName,
        isOldArtistOpen       = self.lastArtistHeader && self.lastArtistHeader.hasClass(ACTIVE_CLASS),
        shouldCloseOldArtist  = isDifferentArtist && isOldArtistOpen;

    shouldCloseOldArtist && toggleArtist(self.lastArtistHeader, self.lastArtistSongs);
    
    toggleArtist(artistHeader, artistSongs);
    self.lastArtistName   = this.artistName;
    self.lastArtistHeader = artistHeader;
    self.lastArtistSongs  = artistSongs;
}

function toggleArtist(artistHeader, artistSongs) {
    var isOpen = artistHeader.hasClass(ACTIVE_CLASS);
    artistHeader.toggleClass(ACTIVE_CLASS, !isOpen);
    var slideDirection = isOpen ? 'slideUp' : 'slideDown';
    artistSongs.velocity('finish').velocity(slideDirection, { duration: 300 });
}