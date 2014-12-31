var lastPlayedSongId;

Template.nowPlaying.helpers({
  nowPlayingSong: getNowPlayingSong
});

function getNowPlayingSong() {
  return Songs.findOne(App.cloud().nowPlayingSongId);
}