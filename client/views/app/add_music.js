var SONG_SEARCH_RESULTS = 'songSearchResults';
Template.addMusic.rendered = initAddMusicTemplate;

Template.addMusic.helpers({
  songs: function() { return Session.get(SONG_SEARCH_RESULTS) }
});

Template.addMusic.events({
  'click h4': toggleAddMusicPane,

  'focus input': toggleSearchFocusClass,
  'blur  input': toggleSearchFocusClass
});


function initAddMusicTemplate() {
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


function loadSearchResults(query) {
  if (query) {
    Backend.getQueryResultsFromGrooveShark(query, function(results) {
      Session.set(SONG_SEARCH_RESULTS, results);
    });
  }
  else {
    clearSongSearchResults();
  }
}


function clearSongSearchResults() {
  Session.set(SONG_SEARCH_RESULTS, []);
}


function toggleAddMusicPane(event, template) {
  template.musicPane.toggleClass('active');
  clearSongSearchResults();
  template.searchInput.val('');
}


function toggleSearchFocusClass(event, template) {
  template.searchHolder.toggleClass('focused');
}