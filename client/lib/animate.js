Animate = new function () {
    var self = this;

    self.$removeQueueItems = function ($removeItems) {
        var $deferred = $.Deferred();
        $removeItems.animate({opacity: 0, height: 0}, 300).promise().done(function () {
            $removeItems.remove();
            $deferred.resolve();
        });
        return $deferred;
    }


    self.$addQueueItems = function ($addItems) {
        return $addItems.css({height: 0, opacity: 0}).appendTo("#queueContainer")
            .animate({height: "4em", opacity: 1}, 300);
    }


    self.moveSongUpInQueue = function (from, to) {

        function isValidParams() {
            return to >= from
        }

        if (isValidParams()) {
            throw new Error('Invalid indexes to move --- From: ' + from + ' --- To: ' + to);
            return;
        }

        // setup and grab elements
        var $deferred = $.Deferred(),
            $queue = $('#queueContainer li'),
            animateTime = 500,
            $song = $($queue.get(from)),
            $songToMoveDown = $($queue.get(to)),
            $songToCloseGapOn = $($queue.get(from - 1)),
            $tempSongSpaceHolder = $($.parseHTML("<li style='height:0; opacity:0'></li>"));

        // determine animate distance
        var numSpotsToMove = to - from,
            songHeight = $song.outerHeight(),
            songMargin = parseInt($song.css('margin-top')),
            spaceToMove = Math.floor(numSpotsToMove * (songHeight + songMargin)) + 'px';

        (function animateSongItems() {
            $songToMoveDown.before($tempSongSpaceHolder);
            $.when($song.css({"z-index": 2}).animate({top: spaceToMove}, animateTime),
                    $songToCloseGapOn.animate({'margin-bottom': '-' + (songHeight + songMargin) + 'px'}, animateTime),
                    $tempSongSpaceHolder.animate({height: songHeight}, animateTime))
                .done(switchDOM);
        })();

        function switchDOM() {
            $song.css({top: "0", "z-index": 1});
            $tempSongSpaceHolder.replaceWith($song.remove());
            $songToCloseGapOn.css({'margin-bottom': songMargin + 'px'});
            $deferred.resolve();
        }

        return $deferred;
    }
};