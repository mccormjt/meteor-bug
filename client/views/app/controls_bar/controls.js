var self;
var PAUSED_CLASS = 'paused';

Template.controls.created = function() {
  self = this;
}


Template.controls.rendered = function() {
  setupAudioPlayer();
  setupVolumeSlider();
  self.autorun(initializeControls);
};


Template.controls.destroyed = function() {
  self.player.clearSrc();
};


Template.controls.helpers({
  playerPauseStateClass:  getplayerPauseStateClass
});


Template.controls.events({
  'click .skip':          skipNowPlayingSong,
  'click .play-pause':    togglePauseState
});


function initializeControls() {
  if (App.isAdmin()) {
    $(self.firstNode).fadeIn(300);
    self.volumeSlider.rangeslider({ polyfill: false });
  } else {
    $(self.firstNode).hide();
    self.volumeSlider.rangeslider('destroy');
  }
}

function setupAudioPlayer() {
  self.playPauseButton = this.$('.play-pause');
  self.player = new CrossPlayer(skipNowPlayingSong);
  self.autorun(ensureNowPlayingSrc);
  self.autorun(updatePlayerPauseState);
}


function setupVolumeSlider() {
  self.volumeSlider = $('.volume-slider input');
  self.autorun(syncLocalVolumeFromMaster)
  self.volumeSlider.change(updateMasterCloudVolumeFromSlider);
}


function updateMasterCloudVolumeFromSlider() {
  var newVolume  = self.volumeSlider.val();
  var hasChanged = newVolume != App.cloud().volume;
  hasChanged && Meteor.call('setCloudVolume', newVolume);
}


function syncLocalVolumeFromMaster() {
  var cloudVolume = App.cloud().volume;
  if (self.player.volume() != cloudVolume) {
    self.player.volume(cloudVolume);
    self.volumeSlider.val(cloudVolume).change();
  }
}


function ensureNowPlayingSrc() {
  var nowPlayingSongId = App.cloud().nowPlayingSongId;
  if (App.isOutput() && App.anySongsQueued()) {
    if (nowPlayingSongId) {
      !self.player.src() && loadSong(Songs.findOne(nowPlayingSongId));
    } else {
      loadSong(App.songQueue().fetch()[0]);
    }
  } else {
    self.player.clearSrc();
  }
}


function loadSong(song) {
  Backend.getGrooveSharkStreamingUrl(song.groovesharkSongId, function(data) {
    if (song._id != App.cloud().nowPlayingSongId) return;
    self.player.src(data.stream_url);
    updatePlayerPauseState();
  });
  Clouds.update({ _id: App.cloudId() }, { $set: { nowPlayingSongId: song._id } });
}


function updatePlayerPauseState() { 
  if (!App.isOutput()) return;
  App.cloud().isPaused ? self.player.pause() : self.player.play();
}


function getplayerPauseStateClass() {
  if (Clouds.findOne().isPaused) return PAUSED_CLASS;
}


function skipNowPlayingSong() {
   Meteor.call('log', 'SKIP');
  Meteor.call('skipNowPlayingSong');
}


function togglePauseState() {
  var cloud    = Clouds.findOne(),
      isPaused = !cloud.isPaused;
  Clouds.update({ _id: cloud._id }, { $set: { isPaused: isPaused } });
}