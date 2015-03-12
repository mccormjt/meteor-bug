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
    $(window).off('keyup');
};


Template.controls.helpers({
    playerPauseStateClass:  getplayerPauseStateClass
});


Template.controls.events({
    'click .skip':          skipNowPlayingSong,
    'click .play-pause':    togglePauseState
});


function initializeControls() {
    var playerControls = self.$('.player-controls');
    if (App.isAdmin()) {
        playerControls.fadeIn(300);
        self.volumeSlider.rangeslider({ polyfill: false });
    } else {
        playerControls.hide();
        self.volumeSlider.rangeslider('destroy');
    }
}

function setupAudioPlayer() {
    self.playPauseButton = this.$('.play-pause');
    self.player = new CrossPlayer(skipNowPlayingSong, reloadNowPlaying);
    self.autorun(ensureNowPlayingSrc);
    self.autorun(updatePlayerPauseState);
    trackNowPlayingTime();
    $(window).keyup(function onSpacebar(e) { e.keyCode == 32 && togglePauseState() });
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


function ensureNowPlayingSrc(computation, reload) {
    var nowPlayingSongId = App.cloud().nowPlayingSongId;
    if (App.isOutput() && App.anySongsQueued()) {
        var nowPlayingSong = nowPlayingSongId && Songs.findOne(nowPlayingSongId);
        if (nowPlayingSong) {
            (!self.player.src() || reload) && loadSong(nowPlayingSong);
        } else {
            self.player.clearSrc();
            loadSong(App.songQueue()[0]);
        }
    } else {
        self.player.clearSrc();
    }
}


function reloadNowPlaying() {
    ensureNowPlayingSrc(null, true);
}


function loadSong(song) {
    if (self.isLoadingSong) return;
    self.isLoadingSong = true;
    Meteor.call('setCloudLoadingSongState', true);
    Meteor.call('setCloudNowPlayingSongId', song._id);
    Backend.getGrooveSharkStreamingUrl(song.groovesharkSongId, function(data) {
        if (song._id != App.cloud().nowPlayingSongId) return;
        var time = App.cloud().nowPlayingTime;
        self.player.src(data.stream_url, function() {
            setTimeout(function() {
                self.isLoadingSong = false;
                Meteor.call('setCloudLoadingSongState', false);
                self.player.setCurrentTime(time);
                updatePlayerPauseState();
            }, 300);
        });
    });
}


function updatePlayerPauseState() { 
    if (!App.isOutput()) return;
    App.cloud().isPaused ? self.player.pause() : self.player.play();
}


function getplayerPauseStateClass() {
    if (App.cloud().isPaused) return PAUSED_CLASS;
}


function skipNowPlayingSong() {
    self.player.clearSrc();
    Meteor.call('setCloudNowPlayingTime', 0);
    Meteor.call('skipNowPlayingSong');
}


function togglePauseState() {
    var cloud    = Clouds.findOne(),
        isPaused = !cloud.isPaused;
    Meteor.call('setIsCloudPaused', isPaused);
}


function trackNowPlayingTime() {
    setInterval(function() {
        if (!App.isOutput()) return;
        self.player.getCurrentTime(function(currentTime) {
            cloudTime     = App.cloud().nowPlayingTime,
            shouldChange  = currentTime != cloudTime && currentTime > -1;
            shouldChange && Meteor.call('setCloudNowPlayingTime', currentTime);
        });
    }, 3000);
 }