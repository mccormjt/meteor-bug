var self;

Template.findCreate.rendered = function() {
    self = this;
    self.findCon        = this.$('.find-container');
    self.createCon      = this.$('.create-container');
    self.find           = this.$('#find');
    self.create         = this.$('#create');
    self.findG          = self.findCon.find('.fc-input-group');
    self.createG        = self.createCon.find('.fc-input-group');
    self.image          = this.$('img');
    self.toggle         = this.$('.fc-toggle');
    self.toggleBtn      = this.$('.fc-toggle-btn');
    self.publicTog      = true;
    self.findNearCloudsOptions = this.$('#findNearCloudsOptions');
    self.refresh        = this.$('#findOptionsRefresh').click(findAndSetupNearClouds);
    self.nearClouds     = this.$('#nearClouds');
};

Template.findCreate.events({
    'click .find-container': findClicked,
    'click .create-container': createClicked,
    'click .fc-toggle': toggleClicked,
    'click #find-btn': findGo,
    'click #create-btn': createGo
});


function findClicked() {
    self.find.html('');
    self.create.html('');
    self.findCon.removeClass('btn-fade');
    self.createCon.addClass('btn-fade');
    self.findCon.addClass('btn-expand');
    self.createCon.removeClass('btn-expand');

    self.findG.removeClass('group-init');
    self.createG.removeClass('group-init');

    self.findG.addClass('fc-appear');
    self.findG.removeClass('fc-disappear');
    self.createG.removeClass('fc-appear');
    self.createG.addClass('fc-disappear');
    self.toggle.removeClass('fc-appear');
    self.toggle.addClass('fc-disappear');

    self.image.addClass('finded');

    findAndSetupNearClouds();
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

    self.findG.removeClass('fc-appear');
    self.findG.addClass('fc-disappear');
    self.createG.addClass('fc-appear');
    self.createG.removeClass('fc-disappear');
    self.toggle.addClass('fc-appear');
    self.toggle.removeClass('fc-disappear');

    self.image.removeClass('finded');
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

}

function createGo() {

}


function findAndSetupNearClouds() {
    self.nearClouds.empty();
    self.refresh.addClass('spinning').off('click');

    $.when(getCurrentLocation())
        .fail(showErrorMessageForNearByClouds)
        .always(resetRefreshHandler)
        .then(function (location) {
            Meteor.call('findCloudsNear', location, function(error, clouds) {
                processNearCloudResults(clouds);
            });
        });

    function resetRefreshHandler() {
        self.refresh.removeClass('spinning').click(findAndSetupNearClouds);
    }

    function processNearCloudResults(data) {
        if (data.length > 0) {
            $.map(data, loadNearCloudResult);
            setupEventHandlingForNearCloudClick();
        }
        else {
            showErrorMessageForNearByClouds('No CloudLists found near you');
        }
    }

    function loadNearCloudResult(cloud) {
        var distance = parseFloat(cloud.distance).toFixed(2),
            result = '<div id=' + cloud._id + '><span>' + cloud.name + '</span><span>' + distance + ' mi</span></div>';
        self.nearClouds.append(result);
    }

    function setupEventHandlingForNearCloudClick() {
        $('#nearClouds div').click(function () {
            var cloudId = $(this).attr('id');
            loadAppWithParams(cloudId, false);
        });
    };
}