var self;
var SONG_SEARCH_RESULTS = 'songSearchResults',
    SEARCHING_CLASS     = 'searching';
Template.addMusic.rendered = initAddMusicTemplate;

Template.addMusic.helpers({
  songResults:     getSongResults,
  hasNoResults:    hasNoResults,
  inQueueClass:    inQueueClass
});

Template.addMusic.events({
  'click h4':      hideAddMusicPane,
  'click input':   showAddMusicPane,
  'focus input':   toggleSearchFocusClass,
  'blur  input':   toggleSearchFocusClass,
  'click .queue-status:not(.songResult.in-queue .queue-status)':  queueSong
});


function initAddMusicTemplate() {
  self = this;
  self.musicPane      = this.$('.add-music');
  self.searchHolder   = this.$('.search');
  self.searchInput    = this.$('input');

  var options = {
    callback: loadSearchResults,
    wait: 400,
    captureLength: 0
  }

  this.searchInput.typeWatch(options);
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
  Meteor.call('queueSong', this.songName, this.artistName, this.songID);
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