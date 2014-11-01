Util = new function () {
    var self = this;

    self.supportsTouch = 'ontouchstart' in window || navigator.msMaxTouchPoints;
    if (self.supportsTouch) $('html').addClass('touch');

    self.isMobileDevice = function () {
        return  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    };

    self.getURLParameter = function (name) {
        return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [, ""])[1].replace(/\+/g, '%20')) || null;
    };

    self.isAdmin = function () {
        return self.getURLParameter('admin') == 'yes';
    };

    self.isOutputDevice = function () {
        return self.getURLParameter('output') == 'yes';
    };

    self.getCloudID = function () {
        return self.getURLParameter('cloudID');
    };

    self.$createSongHtmlElement = function (videoId, title, url, htmlClass) {
        htmlClass = htmlClass || "";
        return $($.parseHTML("<li class='songContainer " + htmlClass + "'" +
            " id='" + videoId + "'>" +
            "<img src='" + url + "' />" +
            "<p>" + title + "</p>" +
            "</li>"));
    };

    self.$createSongHtmlElementFromSongObject = function (song, htmlClass) {
        return self.$createSongHtmlElement(song.id, song.title, song.url, htmlClass);
    };

    self.getRootPath = function () {
        return location.protocol + '//' + location.hostname;
    };

    self.getCookie = function(name) {
        var parts = document.cookie.split(name + "=");
        if (parts.length == 2) return parts.pop().split(";").shift();
    }

    self.getClientIpFromCookie = function() {
        return self.getCookie('client_ip');
    }
};