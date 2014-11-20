Util = new function () {
    var self = this;

    self.supportsTouch = 'ontouchstart' in window || navigator.msMaxTouchPoints;
    if (self.supportsTouch) $('html').addClass('touch');

    self.isMobileDevice = function () {
        return  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    };

    self.isAdmin = function () {
        return !! Router.current().params.query.admin;
    };

    self.isOutputDevice = function () {
        return !! Router.current().params.query.output;
    };

    self.getCookie = function(name) {
        var parts = document.cookie.split(name + "=");
        if (parts.length == 2) return parts.pop().split(";").shift();
    }

    self.getClientIpFromCookie = function() {
        return self.getCookie('client_ip');
    }
};