Template.songQueue.helpers({
  songQueue: getSongQueue
});

function getNowPlayingSongId() {
  return Clouds.findOne().nowPlayingSongId;
}

function getSongQueue() {
  return Songs.find({ _id: { $ne: getNowPlayingSongId() } });
}