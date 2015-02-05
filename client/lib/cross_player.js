CrossPlayer = function(endedCallback, reloadCallback) {
    var player       = {},
        errorHandler = new playerErrorHandler(player, endedCallback, reloadCallback);

     if (Meteor.isCordova) {
         document.addEventListener("deviceready", 
             function() { setupMobilePlayer(player, endedCallback, errorHandler) }, false);
     } else {
        setupDesktopPlayer(player, endedCallback, errorHandler);
     }

    return player;
};


function setupDesktopPlayer(player, onendedFn, errorHandler) {
    var audio = new Audio();

    audio.onended = onendedFn;

    audio.onerror = function() { errorHandler.handleError() };

    player.play  = function() { audio.play()  };

    player.pause = function() { audio.pause() };

    player.volume = function(volume) {
        if (!volume) return audio.volume;
        audio.volume = volume;
    };

    player.getCurrentTime = function(callback) {
        callback(audio.currentTime);
    };

    player.setCurrentTime = function(currentTimeVal) {
        audio.oncanplay = function() {
            audio.currentTime = currentTimeVal;
            audio.oncanplay = null;
        };
    };

    player.src = function(src, callback) {
        if (!src) return $(audio).attr('src');
        errorHandler.resetOnNewSong();
        $(audio).attr('src', src);
        audio.load();
        audio.oncanplaythrough = function() {
            audio.oncanplaythrough = null;
            callback && callback();
        }
    };

    player.clearSrc = function() {
        $(audio).removeAttr('src');
    };
}


function setupMobilePlayer(player, onendedFn, errorHandler) {
    var media, src, volume, status, ignoreStopEvent = false;

    player.play = function() {
        setPlayerState(Media.MEDIA_RUNNING);
    };

    player.pause = function() {
        setPlayerState(Media.MEDIA_PAUSED);
    };

    player.volume = function(volumeVal) {
        if (!volumeVal) return volume;
        volume = volumeVal;
        media && media.setVolume(volumeVal);
    };

    player.getCurrentTime = function(callback) {
        media.getCurrentPosition(callback);
    };

    player.setCurrentTime = function(currentTimeVal) {
        media.seekTo(currentTimeVal * 1000);
    };

    player.src = function(setSrc, callback) {
        if (!setSrc) return src;
        if (src == setSrc) return;
        player.clearSrc();
        errorHandler.resetOnNewSong();
        setTimeout(function() {
            src = setSrc;
            media = new Media(setSrc, mediaEnd, handleError, updateMediaStatus);
            player.volume(volume);
            callback && callback();
        }, 100);
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
            onendedFn();
        }
    }

    function handleError(error) {
        errorHandler.handleError(error);
    }
}


function playerErrorHandler(player, failedSongCallback, reloadCallback) {
    var self                 = this,
        handler              = {},
        alreadyTriedHandling = false,
        isHandling           = false,
        resetTimer           = null;

    handler.handleError = function(error) {
        if (isHandling) {
            return;
        } else if (alreadyTriedHandling) {
            alreadyTriedHandling = false;
            failedSongCallback();
        } else {
            isHandling = alreadyTriedHandling = true;
            startResetTimer();
            setTimeout(reloadCallback, 250); // in case of multiple error calls
        }
        Util.log('ERROR', error);
    };

    handler.reset = function() {
        isHandling = alreadyTriedHandling = false;
        clearTimeout(resetTimer);
    }

    handler.resetOnNewSong = function() {
        !isHandling && handler.reset();
        isHandling = false;
    }

    function startResetTimer() {
        resetTimer = setTimeout(function() { handler.reset() }, 20000);
    }

    return handler;
}
