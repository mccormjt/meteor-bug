var self;
var PAUSED_CLASS = 'paused';

Template.controls.created = function() {
  self = this;
}

Template.controls.rendered = function() {
  self.playPauseButton = this.$('.play-pause');
  if (Util.isOutputDevice()) { renderAudioPlayer() }
};

Template.controls.helpers({
  controlsVisibleClass:   getControlsVisibleClass,
  playerPauseStateClass:  getplayerPauseStateClass
});

Template.controls.events({
  'click .skip':          skipNowPlayingSong,
  'click .play-pause':    togglePauseState
});


function renderAudioPlayer() {
  self.player = new Audio();
  self.playPauseButton.before(self.player);
  self.autorun(updatePlayerSrc);
  self.autorun(updatePlayerPauseState);
  $(self.player).on('ended', skipNowPlayingSong);
}

function updatePlayerSrc() {
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
    self.player.src = '';
  }
}

function updatePlayerPauseState() {
  Clouds.findOne().isPaused ? self.player.pause() : self.player.play();
}

function getplayerPauseStateClass() {
  if (Clouds.findOne().isPaused) return PAUSED_CLASS;
}

function getControlsVisibleClass() {
  if (!Util.isAdmin()) return 'hide';
}

function skipNowPlayingSong() {
  Songs.remove({ _id: Clouds.findOne().nowPlayingSongId });
}

function togglePauseState() {
  var cloud    = Clouds.findOne(),
      isPaused = !cloud.isPaused;
  Clouds.update({ _id: cloud._id }, { $set: { isPaused: isPaused } });
}