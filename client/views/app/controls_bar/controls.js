var self;
var PAUSED_CLASS = 'paused';

Template.controls.created = function() {
  self = this;
}


Template.controls.rendered = function() {
  self.playPauseButton = this.$('.play-pause');
  self.player = new Audio();
  $(self.player).on('ended', skipNowPlayingSong);
  Tracker.autorun(ensureNowPlayingSrc);
  Tracker.autorun(updatePlayerPauseState);
};


Template.controls.destroyed = function() {
  clearPlayerSrc();
};


Template.controls.helpers({
  controlsVisibleClass:   getControlsVisibleClass,
  playerPauseStateClass:  getplayerPauseStateClass
});


Template.controls.events({
  'click .skip':          skipNowPlayingSong,
  'click .play-pause':    togglePauseState
});


function ensureNowPlayingSrc() {
  var nowPlayingSongId = App.cloud().nowPlayingSongId;
  if (App.isOutput() && App.anySongsQueued()) {
    if (nowPlayingSongId) {
      !playerSrc() && loadSong(Songs.findOne(nowPlayingSongId));
    } else {
      loadSong(App.songQueue().fetch()[0]);
    }
  } else {
    clearPlayerSrc();
  }
}


function loadSong(song) {
  Backend.getGrooveSharkStreamingUrl(song.groovesharkSongId, function(data) {
    if (song._id != App.cloud().nowPlayingSongId) return;
    self.player.src = data.stream_url;
    updatePlayerPauseState();
  });
  Clouds.update({ _id: App.cloudId() }, { $set: { nowPlayingSongId: song._id } });
}


function updatePlayerPauseState() { 
  if (!App.isOutput()) return;
  App.cloud().isPaused ? self.player.pause() : self.player.play();
}

function playerSrc() {
  return $(self.player).attr('src');
}

function clearPlayerSrc() {
  self.player.src = '';
}


function getplayerPauseStateClass() {
  if (Clouds.findOne().isPaused) return PAUSED_CLASS;
}


function getControlsVisibleClass() {
  if (!App.isAdmin()) return 'hide';
}


function skipNowPlayingSong() {
  Meteor.call('skipNowPlayingSong');
}


function togglePauseState() {
  var cloud    = Clouds.findOne(),
      isPaused = !cloud.isPaused;
  Clouds.update({ _id: cloud._id }, { $set: { isPaused: isPaused } });
}