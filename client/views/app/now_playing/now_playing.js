var self,
    lastPlayedSongId,
    LOADING_SONG_CLASS = 'loading';

Template.nowPlaying.rendered = function() {
  self = this;
  self.autorun(updateNowPlayingLoadingState);
}

Template.nowPlaying.helpers({
  nowPlayingSong: getNowPlayingSong
});

function getNowPlayingSong() {
  return Songs.findOne(App.cloud().nowPlayingSongId);
}

function updateNowPlayingLoadingState() {
  self.$('.now-playing').toggleClass(LOADING_SONG_CLASS, App.cloud().isLoadingSong);
}