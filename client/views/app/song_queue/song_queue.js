Template.songQueue.helpers({
  songQueue: songQueue
});

function nowPlayingSongId() {
  return Clouds.findOne().nowPlayingSongId;
}

function songQueue() {
  return Songs.find({ _id: { $ne: nowPlayingSongId() } }, { sort: { voteCount: -1 } });
}