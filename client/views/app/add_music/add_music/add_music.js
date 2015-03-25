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
    self.isAddMusicPaneOpen   = false;
    setupTypeWatch();
};

Template.addMusic.destroyed = function() {
    HashChanger.stopListeningFor('add-music');
};

Template.addMusic.events({
    'click h4':                                    toggleAddMusicStateHash,
    'click .previous-songs-mode:not(.active)':     toggleAddMusicMode,
    'click .search-songs-mode:not(.active)':       toggleAddMusicMode,
    'focus input, blur input':                     toggleSearchFocusClass,
    'keyup input':                                 Util.stopEventPropagation
});

function toggleAddMusicStateHash() {
    self.isAddMusicPaneOpen ? HashChanger.clearHash() : HashChanger.hashSetterFnFor('add-music')();
}

function showAddMusicPane() {
    toggleMusicPane('125px', true);
}

function hideAddMusicPane() {
    toggleMusicPane('100%', false);
}

function toggleMusicPane(topVal, isOpen) {
    clearMusicPane();
    self.isAddMusicPaneOpen = isOpen;
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