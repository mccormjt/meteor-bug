Template.currentPlaylist.helpers({
    cloud: App.cloud,
    contributorCount: contributorCount,
    songsQueuedCount: songsQueuedCount
});

function contributorCount() {
    return CloudUsers.find().count();
}

function songsQueuedCount() {
    return Songs.find({ isQueued: true }).count();
}