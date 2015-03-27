var self,
    SCROLL_CLASS = 'scroll-y';

Template.home.rendered = function() {
    self = this;
    self.findCon        = this.$('.find-container');
    self.createCon      = this.$('.create-container');
    self.find           = this.$('#find');
    self.create         = this.$('#create');
    self.findG          = self.findCon.find('.fc-input-group');
    self.createG        = self.createCon.find('.fc-input-group');
    self.image          = this.$('img');
    self.backCon        = this.$('.back-container');
    self.toggle         = this.$('.fc-toggle');
    self.toggleBtn      = this.$('.fc-toggle-btn');
    self.findIn         = this.$('#find-in');
    self.publicTog      = true;
    self.nearClouds     = this.$('#nearClouds');

    if(!window.isMobileDevice()) {
        if ($(window).width() < 1100) {
            setByWidth(true); // this sets the skrollr attributes for medium browser sizes
        } else {
            setByWidth(false); // this sets it for larger/fullscreen browser sizes
        }
    }

    $('html').addClass(SCROLL_CLASS);
    self.skrollr = skrollr.init();
    self.autorun(subcribeToNearClouds);

    if(window.isMobileDevice()) {
        this.$('.home').addClass('on-mobile');
        self.find.html('');
        self.findCon.addClass('btn-expand');
        self.findG.removeClass('group-init');
        self.findG.addClass('fc-appear');
    }
};

Template.home.destroyed = function() {
    self.skrollr.destroy();
    $('html').removeClass(SCROLL_CLASS);
};

Template.home.helpers({
    clouds          : getClouds,
    cloudDistance   : cloudDistance,
    noCloudsMsg     : getNoCloudsMsg
});

Template.home.events({
    'click .find-container'     : findClicked,
    'click .create-container'   : createClicked,
    'click .fc-toggle'          : toggleClicked,
    'click #find-btn'           : findGo,
    'click #create-btn'         : createGo,
    'click .back-container'     : backClicked,
    'click .go-down'            : scrollToLand
});

function setByWidth(width) {
    if(width) { // medium width (half-screenish)
        $(".ribbon").attr("data-1200", "top:20vh;");
        $("#a-queue").attr("data-1200", "opacity:1;top:calc(20vh + 12vw);");
        $("#a-queue").attr("data-2200", "opacity:1;top:calc(20vh + 12vw);");
        $("#i-song1").attr("data-1800", "top[swing]:3.5vw;");
        $("#i-song1").attr("data-2000", "top:13.5vw;");
        $("#i-song2-1").attr("data-1750", "top:13.5vw; opacity:!1;");
        $("#i-song2-2").attr("data-1800", "top[swing]:13.5vw;");
        $("#i-song2-2").attr("data-2000", "top:3.5vw;");
        $("#i-mouse").attr("data-1700", "left:75vw;top:calc(20vh + 27.2vw);");
        $("#i-phone").attr("data-2600", "top:calc(20vh + 18.5vw);");
    } else { // large width (full-screenish)
        $(".ribbon").attr("data-1200", "top:20vh;");
        $("#a-queue").attr("data-1200", "opacity:1;top:calc(20vh + 9vw);");
        $("#a-queue").attr("data-2200", "opacity:1;top:calc(20vh + 9vw);");
        $("#i-song1").attr("data-1800", "top[swing]:2.7vw;");
        $("#i-song1").attr("data-2000", "top:10vw;");
        $("#i-song2-1").attr("data-1750", "top:10vw; opacity:!1;");
        $("#i-song2-2").attr("data-1800", "top[swing]:10vw;");
        $("#i-song2-2").attr("data-2000", "top:2.7vw;");
        $("#i-mouse").attr("data-1700", "left:68vw;top:calc(20vh + 20.2vw);");
        $("#i-phone").attr("data-2600", "top:calc(20vh + 14.5vw);");
    }
}

function getClouds() {
    return Clouds.find();
}

function cloudDistance() {
    var coords = getLocationCoords();
    return coords && Clouds.distanceFromCloud(this, coords).toFixed(2) + ' mi';
}

function getNoCloudsMsg() {
    if (getClouds().count() === 0) {
        return 'Loading public playlists near you...';
    } else {
        return Geolocation.error().message;
    }
}


function findClicked() {
    if(!window.isMobileDevice()) {
        self.find.html('');
        self.create.html('');
        self.findCon.removeClass('btn-fade');
        self.createCon.addClass('btn-fade');
        self.findCon.addClass('btn-expand');
        self.createCon.removeClass('btn-expand');

        self.findG.removeClass('group-init');
        self.createG.removeClass('group-init');
        self.backCon.removeClass('back-init');

        self.findG.addClass('fc-appear');
        self.findG.removeClass('fc-disappear');
        self.createG.removeClass('fc-appear');
        self.createG.addClass('fc-disappear');
        self.toggle.removeClass('fc-appear');
        self.toggle.addClass('fc-disappear');

        self.image.addClass('finded');
        self.backCon.addClass('finded-b');
    }
}

function createClicked() {
    self.find.html('');
    self.create.html('');
    self.findCon.addClass('btn-fade');
    self.createCon.removeClass('btn-fade');
    self.findCon.removeClass('btn-expand');
    self.createCon.addClass('btn-expand');

    self.findG.removeClass('group-init');
    self.createG.removeClass('group-init');
    self.toggle.removeClass('group-init');
    self.backCon.removeClass('back-init');

    self.findG.removeClass('fc-appear');
    self.findG.addClass('fc-disappear');
    self.createG.addClass('fc-appear');
    self.createG.removeClass('fc-disappear');
    self.toggle.addClass('fc-appear');
    self.toggle.removeClass('fc-disappear');

    self.image.removeClass('finded');
    self.backCon.removeClass('finded-b');
}

function toggleClicked() {
    if (self.publicTog) {
        self.toggleBtn.addClass('fc-toggle-btn-private');
        self.toggleBtn.html('Private');
    } else {
        self.toggleBtn.removeClass('fc-toggle-btn-private');
        self.toggleBtn.html('Public');
    }
    self.publicTog = !self.publicTog;
}

function findGo() {
    Meteor.call('findCloudById', self.findIn.val(), function(error, cloud) {
        if(cloud) {
            Router.go('app', {cloudId: cloud._id});
        } else {
            alert("no cloud sir..");
        }
    });
}

function createGo() {
    var cloudName = self.$('#create-name').val();
    Meteor.call('createCloud', cloudName, self.publicTog, getLocationCoords(), function(error, cloudId) {
        Meteor.call('ensureCloudUser', true, cloudId, function() {
            Router.go('app', { cloudId: cloudId });
        });
    });
}

function subcribeToNearClouds() {
    var coords = getLocationCoords();
    coords && self.subscribe('cloudsNearLocation', coords);
}

function getLocationCoords() {
    var loc = Geolocation.currentLocation();
    return loc &&  _.pick(loc.coords, 'latitude', 'longitude', 'accuracy');
}

function backClicked() {
    self.findCon.removeClass('btn-fade');
    self.createCon.removeClass('btn-fade');
    self.findCon.removeClass('btn-expand');
    self.createCon.removeClass('btn-expand');

    self.find.html('find');
    self.create.html('create');

    self.findG.addClass('group-init');
    self.createG.addClass('group-init');
    self.backCon.addClass('back-init');

    self.toggle.removeClass('fc-appear');
    self.toggle.addClass('fc-disappear');

    self.image.removeClass('finded');
    self.backCon.removeClass('finded-b');
}

function scrollToLand() {
    self.skrollr.animateTo(1200);
}
