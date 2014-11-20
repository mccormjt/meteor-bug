Template.nowPlaying.helpers({
  nowPlayingSong: getNowPlayingSong
});

function getNowPlayingSong() {
  var cloud = Clouds.findOne(),
      song  = Songs.findOne(cloud.nowPlayingSongId);
  if (!song) {
    song = Songs.findOne(),
    songId = (song && song._id) || '';
    Clouds.update({ _id: cloud._id }, { $set: { nowPlayingSongId: songId } });
  }
  return song;
}