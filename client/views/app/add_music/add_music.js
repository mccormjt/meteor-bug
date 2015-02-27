var self;
var SONG_SEARCH_RESULTS = 'songSearchResults',
    SEARCHING_CLASS     = 'searching';

Template.addMusic.created = function() {
    self = this;
    HashChanger.listenFor('add-music', showAddMusicPane, hideAddMusicPane);
};

Template.addMusic.rendered = function() {
    self.musicPane      = this.$('.add-music');
    self.searchHolder   = this.$('.search');
    self.searchInput    = this.$('input');
    setupTypeWatch();
};

Template.addMusic.destroyed = function() {
    HashChanger.stopListeningFor('add-music');
};

Template.addMusic.helpers({
    songResults:     getSongResults,
    hasNoResults:    hasNoResults,
    inQueueClass:    inQueueClass
});

Template.addMusic.events({
    'click h4':                    HashChanger.clearHash,
    'click input':                 HashChanger.hashSetterFnFor('add-music'),
    'focus input, blur input':     toggleSearchFocusClass,
    'keyup input':                 Util.stopEventPropagation,
    'click .queue-status:not(.songResult.in-queue .queue-status)':  queueSong,
});


function setupTypeWatch() {
    self.searchInput.typeWatch({
        callback: loadSearchResults,
        wait: 400,
        captureLength: 0
    });
}

function isQueued(guid) {
    return !! Songs.findOne({ guid: guid, isQueued: true });
}

function inQueueClass() {
    var guid = Songs.createSongGuid(this.songName, this.artistName);
    return isQueued(guid) ? 'in-queue' : ''
}

function getSongResults() { 
    return Session.get(SONG_SEARCH_RESULTS);
}

function hasNoResults() {
    var results = getSongResults();
    return results && !results.length;
}

function queueSong(event) {
    Meteor.call('queueSong', this.songName, this.artistName, this.songID, getSongPriorityForUser());
}

function loadSearchResults(query) {
    self.searchHolder.addClass(SEARCHING_CLASS);
    if (query) {
        Backend.getQueryResultsFromGrooveShark(query, function(results) {
            Session.set(SONG_SEARCH_RESULTS, results);
            self.searchHolder.removeClass(SEARCHING_CLASS);
        });
    } else {
        clearMusicPane();
    }
}

function clearMusicPane() {
    Session.set(SONG_SEARCH_RESULTS, null);
    self.searchInput.val('');
    self.searchHolder.removeClass(SEARCHING_CLASS);
}

function showAddMusicPane() {
    clearMusicPane();
    self.musicPane.addClass('active');
    $('html, body').scrollTop(0);
}

function hideAddMusicPane() {
    clearMusicPane();
    self.musicPane.removeClass('active');
}

function toggleSearchFocusClass() {
    self.searchHolder.toggleClass('focused');
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