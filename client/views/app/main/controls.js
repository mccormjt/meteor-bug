var self;
var PAUSED_CLASS = 'paused';

Template.controls.created = function() {
  self = this;
}

Template.controls.rendered = function() {
  self.playPauseButton = this.$('.play-pause');
  self.player = new Audio();
  $(self.player).on('ended', skipNowPlayingSong);
  Tracker.autorun(updatePlayerSrc);
  Tracker.autorun(updatePlayerPauseState);
};

Template.controls.destroyed = function() {
  clearPlayerSrc();
};

Template.controls.helpers({
  controlsVisibleClass:   getControlsVisibleClass,
  playerPauseStateClass:  getplayerPauseStateClass,
  updatePlayerSrc:        updatePlayerSrc,
  clearPlayerSrc:         clearPlayerSrc,
  updatePlayerPauseState: updatePlayerPauseState
});

Template.controls.events({
  'click .skip':          skipNowPlayingSong,
  'click .play-pause':    togglePauseState
});

function updatePlayerSrc() {
  if (!App.isOutput()) {
    clearPlayerSrc();
    return;
  }

  var nowPlayingSongId = Clouds.findOne().nowPlayingSongId,
      songHasChanged   = nowPlayingSongId != self.lastNowPlayingSongId;

  if (!songHasChanged) return;
  self.lastNowPlayingSongId = nowPlayingSongId;
  var nextSong = Songs.findOne(nowPlayingSongId);

  if (nextSong) {
    Backend.getGrooveSharkStreamingUrl(nextSong.groovesharkSongId, function(data) {
      self.player.src = data.stream_url;
      updatePlayerPauseState();
    });
  } else {
    clearPlayerSrc();
  }
}

function updatePlayerPauseState() { 
  if (!App.isOutput()) return;
  Clouds.findOne().isPaused ? self.player.pause() : self.player.play();
}

function clearPlayerSrc() {
  self.player.src = self.lastNowPlayingSongId = '';
}

function getplayerPauseStateClass() {
  if (Clouds.findOne().isPaused) return PAUSED_CLASS;
}

function getControlsVisibleClass() {
  if (!App.isAdmin()) return 'hide';
}

function skipNowPlayingSong() {
  Songs.remove({ _id: Clouds.findOne().nowPlayingSongId });
}

function togglePauseState() {
  var cloud    = Clouds.findOne(),
      isPaused = !cloud.isPaused;
  Clouds.update({ _id: cloud._id }, { $set: { isPaused: isPaused } });
}