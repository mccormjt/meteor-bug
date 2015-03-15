var self,
    ACTIVE_CLASS            = 'active',
    SEARCHING_CLASS         = 'searching',
    SONG_SEARCH_RESULTS     = 'songSearchResults';

Template.addMusic.created = function() {
    self = this;
    self.isAddMusicPaneOpen = new ReactiveVar(false);
    HashChanger.listenFor('add-music', showAddMusicPane, hideAddMusicPane);
};

Template.addMusic.rendered = function() {
    self.musicPane            = self.$('.add-music');
    self.previousSongsMode    = self.$('.previous-songs-mode');
    self.searchMode           = self.$('.search-songs-mode');
    self.searchInput          = self.$('input');
    setupTypeWatch();
};

Template.addMusic.destroyed = function() {
    HashChanger.stopListeningFor('add-music');
};

Template.addMusic.helpers({
    isAddMusicPaneOpen: isAddMusicPaneOpen
});

Template.addMusic.events({
    'click h4':                                             toggleAddMusicStateHash,
    'click .previous-songs-mode:not(.active)':              toggleAddMusicMode,
    'click .search-songs-mode:not(.active)':                toggleAddMusicMode,
    'focus input, blur input':                              toggleSearchFocusClass,
    'keyup input':                                          Util.stopEventPropagation,
    'click .queue-status:not(.in-queue .queue-status)':     queueSong,
});

function isAddMusicPaneOpen() {
    return self.isAddMusicPaneOpen.get();
}

function toggleAddMusicStateHash() {
    isAddMusicPaneOpen() ? HashChanger.clearHash() : HashChanger.hashSetterFnFor('add-music')();
}

function showAddMusicPane() {
    toggleMusicPane('125px', true);
}

function hideAddMusicPane() {
    toggleMusicPane('100%', false);
}

function toggleMusicPane(topVal, isOpen) {
    clearMusicPane();
    self.isAddMusicPaneOpen.set(isOpen);
    self.musicPane.toggleClass(ACTIVE_CLASS, isOpen)
                  .velocity({ top: topVal }, { duration: 325, easing: 'ease' });
}

function clearMusicPane() {
    Session.set(SONG_SEARCH_RESULTS, null);
    self.searchInput.val('');
    self.searchMode.removeClass(SEARCHING_CLASS);
}

function setupTypeWatch() {
    self.searchInput.typeWatch({
        callback: loadSearchResults,
        wait: 400,
        captureLength: 0
    });
}

function toggleAddMusicMode() {
    var query = '.previous-songs-mode, .search-songs-mode,'
                + '.previous-songs, .search-results';
    self.$(query).toggleClass(ACTIVE_CLASS);
}

function queueSong(event) {
    var groovesharkSongId = this.songID || this.groovesharkSongId;
    Meteor.call('queueSong', this.songName, this.artistName, groovesharkSongId, getSongPriorityForUser());
}

function toggleSearchFocusClass() {
    self.searchMode.toggleClass('focused');
}

function loadSearchResults(query) {
    self.searchMode.addClass(SEARCHING_CLASS);
    if (query) {
        Backend.getQueryResultsFromGrooveShark(query, function(results) {
            Session.set(SONG_SEARCH_RESULTS, results);
            self.searchMode.removeClass(SEARCHING_CLASS);
        });
    } else {
        clearMusicPane();
    }
}

function getSongPriorityForUser() {
    var userId = Meteor.userId(),
        highestOverallPriority,
        usersLowestPriority;

    Songs.find({ isQueued: true }).forEach(function(song) {
        if (song.addedByUserId == userId) {
            usersLowestPriority || (usersLowestPriority = song.priority);
            usersLowestPriority = Math.max(usersLowestPriority, song.priority);
        } else if (!usersLowestPriority) {
            highestOverallPriority || (highestOverallPriority = song.priority);
            highestOverallPriority = Math.min(highestOverallPriority, song.priority);
        }
  });

  usersLowestPriority && usersLowestPriority++;
  return usersLowestPriority || highestOverallPriority || 1;
}