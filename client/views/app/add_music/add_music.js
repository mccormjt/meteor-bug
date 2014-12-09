var self;
var SONG_SEARCH_RESULTS = 'songSearchResults',
    SEARCHING_CLASS     = 'searching';
Template.addMusic.rendered = initAddMusicTemplate;

Template.addMusic.helpers({
  songResults:     getSongResults,
  hasNoResults:    hasNoResults,
  inQueueClass:    function() { return Songs.findOne({ groovesharkSongId: this.songID }) ? 'in-queue' : '' }
});

Template.addMusic.events({
  'click h4':      hideAddMusicPane,
  'click input':   showAddMusicPane,
  'focus input':   toggleSearchFocusClass,
  'blur  input':   toggleSearchFocusClass,
  'click .queue-status:not(.songResult.in-queue .queue-status)':  addSongToQueue
});


function initAddMusicTemplate() {
  self = this;
  self.musicPane      = $('.add-music');
  self.searchHolder   = this.$('.search');
  self.searchInput    = this.$('input');

  var options = {
    callback: loadSearchResults,
    wait: 400,
    captureLength: 0
  }

  this.searchInput.typeWatch(options);
}

function getSongResults() { 
  return Session.get(SONG_SEARCH_RESULTS);
}

function hasNoResults() {
  var results = getSongResults();
  return results && !results.length;
}

function addSongToQueue(event) {
  var self = this;
  Meteor.call('insertSong', self.songName, self.artistName, self.songID, function() {
    Meteor.call('voteForSong', self.songID, 1); 
  });
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