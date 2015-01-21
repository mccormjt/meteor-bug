CrossPlayer = function(onendedFn) {
    var self   = this,
        player = {};

    if (Meteor.isCordova) {
        document.addEventListener("deviceready", setupMobilePlayer, false);
    } else {
        setupDesktopPlayer();
    }

    function setupDesktopPlayer() {
        var audio = new Audio();
        $(audio).on('ended', onendedFn);

        player.play  = function() { audio.play()  };

        player.pause = function() { audio.pause() };

        player.volume = function(volume) {
            if (!volume) return audio.volume;
            audio.volume = volume;
        };

        player.src = function(src) {
            if (!src) return $(audio).attr('src');
            audio.src = src;
        };

        player.clearSrc = function() {
            player.src('');
        };
    }


    function setupMobilePlayer() {
        var media, src, volume, status, ignoreStopEvent = false;

        player.play = function() {
            setPlayerState(Media.MEDIA_RUNNING);
        };

        player.pause = function() {
            setPlayerState(Media.MEDIA_PAUSED);
        };

        player.volume = function(volumeVal) {
            if (!volumeVal) return volume;
            media && media.setVolume(volumeVal) && (volume = volumeVal);
        };

        player.src = function(setSrc) {
            if (!setSrc) return src;
            if (src == setSrc) return;
            player.clearSrc();
            media = new Media(setSrc, mediaEnd, logError, updateMediaStatus);
            src = setSrc;
            updatePlayPauseState(status);
        };

        player.clearSrc = function() {
            if (!media) return;
            ignoreStopEvent = true;
            media.stop();
            media.release();
            media = src = volume = null;
        }

        function updateMediaStatus(currentStatus) {
            status = currentStatus;
        }

        function setPlayerState(setStatus) {
            if (setStatus == status || !media) return;
            updatePlayPauseState(setStatus);
        }

        function updatePlayPauseState(compareStatus) {
            compareStatus == Media.MEDIA_PAUSED ? media.pause() : media.play();
        }

        function mediaEnd() {
            if (ignoreStopEvent) {
                ignoreStopEvent = false;
            } else {
                Meteor.call('log', 'END!!!!!');
                onendedFn();
            }
        }

        function logError(error) {
            Meteor.call('log', 'ERROR', error);
        }
    }

    return player;
};