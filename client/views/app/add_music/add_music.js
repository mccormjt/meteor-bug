var self;
var SONG_SEARCH_RESULTS = 'songSearchResults';
Template.addMusic.rendered = initAddMusicTemplate;

Template.addMusic.helpers({
  songResults:   function() { return Session.get(SONG_SEARCH_RESULTS) },
  inQueue:       function() { return Songs.findOne({ groovesharkSongId: this.songID }) ? 'in-queue' : '' }
});

Template.addMusic.events({
  'click h4':             hideAddMusicPane,
  'click input':          showAddMusicPane,
  'focus input':          toggleSearchFocusClass,
  'blur  input':          toggleSearchFocusClass,
  'click .queue-status:not(.songResult.in-queue .queue-status)':  insertSong
});


function initAddMusicTemplate() {
  self = this;
  this.musicPane      = $('.add-music');
  this.searchHolder   = this.$('.search');
  this.searchInput    = this.$('input');

  var options = {
    callback: loadSearchResults,
    wait: 400,
    captureLength: 0
  }

  this.searchInput.typeWatch(options);
}


function insertSong(event) {
  Meteor.call('insertSong', this.songName, this.artistName,
               this.songID, Clouds.findOne()._id);
}


function loadSearchResults(query) {
  if (query) {
    Backend.getQueryResultsFromGrooveShark(query, function(results) {
      Session.set(SONG_SEARCH_RESULTS, results);
    });
  } else {
    clearMusicPane();
  }
}


function clearMusicPane() {
  Session.set(SONG_SEARCH_RESULTS, []);
  self.searchInput.val('');
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