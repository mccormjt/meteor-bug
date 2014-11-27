Template.home.rendered = MenuOptions;

var STD_ANIMATE_TIME = 250;

function MenuOptions() {

    var $startOptions = $('#startOptions'),
        $find = $('#find', $startOptions).click(toggleToNearCloudOptions),
        $create = $('#create', $startOptions).click(toggleToCreateCloudOptions),
        $backButton = $('#backButton').click(toggleBackToStartOptions),
        FindOptions = new NearCloudsOptions(),
        CreateOptions = new CreateNewCloudOptions(),
        stateTransitionFns = [FindOptions.toggleAway,  CreateOptions.toggleAway],
        state = -1;


    function toggleAwayFromStartOptions(callbackFn) {
        $startOptions.fadeOut(STD_ANIMATE_TIME, function () {
            $backButton.fadeIn(STD_ANIMATE_TIME).css({display: 'table-cell'});
            callbackFn();
        });
    }

    function toggleBackToStartOptions() {
        $backButton.fadeOut(STD_ANIMATE_TIME);
        stateTransitionFns[state](function() {
            $startOptions.fadeIn(STD_ANIMATE_TIME);
        });
        state = -1;
    }


    function toggleToNearCloudOptions() {
        state = 0;
       toggleAwayFromStartOptions(FindOptions.toggleInto);
    }


    function toggleToCreateCloudOptions() {
        state = 1;
        toggleAwayFromStartOptions(CreateOptions.toggleInto);
    }

};


// ===================================================================================================



function NearCloudsOptions() {

    var self = this,
        $findNearCloudsOptions = $('#findNearCloudsOptions'),
        $refresh = $('#findOptionsRefresh').click(findAndSetupNearClouds),
        $nearClouds = $('#nearClouds', $findNearCloudsOptions),
        $enterID_field = $('input', $findNearCloudsOptions),
        $enterID_go_button = $('button', $findNearCloudsOptions).click(enterCloudIdHandler);


    self.toggleInto = function() {
        $findNearCloudsOptions.css({display: 'block'}).animate({height: '24em', opacity: '1'}, STD_ANIMATE_TIME);
        $refresh.stop().fadeIn(STD_ANIMATE_TIME).css({display: 'table-cell'});
        findAndSetupNearClouds();
    };

    self.toggleAway = function(callback) {
        $refresh.stop().fadeOut(STD_ANIMATE_TIME);
        $findNearCloudsOptions.fadeOut(STD_ANIMATE_TIME, function () {
            $findNearCloudsOptions.css({display: 'none', height: '0', opacity: '0'});
            callback && callback();
        });
    };


    (function attachHoverEffectsToEnterIdField() {
        var originalColor = $enterID_field.css('background-color');

        function focusIn() {
            $enterID_field.stop().animate({'background-color': 'white'}, STD_ANIMATE_TIME);
        }

        function focusOut() {
            $enterID_field.stop().animate({'background-color': originalColor}, STD_ANIMATE_TIME);
        }

        $enterID_field.focus(focusIn).focusout(focusOut);
    })();

    function findAndSetupNearClouds() {
        $nearClouds.empty();
        $refresh.addClass('spinning').off('click');

        $.when(getCurrentLocation())
            .fail(showErrorMessageForNearByClouds)
            .always(resetRefreshHandler)
            .then(function (location) {
                Meteor.call('findCloudsNear', location, function(error, clouds) {
                    processNearCloudResults(clouds);
                });
            });

        function resetRefreshHandler() {
            $refresh.removeClass('spinning').click(findAndSetupNearClouds);
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
            $nearClouds.append(result);
        }

        function setupEventHandlingForNearCloudClick() {
            $('#nearClouds div').click(function () {
                var $cloud = $(this),
                    cloudID = $cloud.attr('id'),
                    name = $('span:first-child', $cloud).html();
                loadAppWithParams(cloudID, name, false);
            });
        };
    }


    function enterCloudIdHandler() {
        var fieldValue = $enterID_field.val();
        if (fieldValue) {
            $.when(verifyCloudID(fieldValue))
                .done(function (cloud) {
                    loadAppWithParams(cloud._id, cloud.name, false);
                })
                .fail(function () {
                    $enterID_field.val("");
                    flashFieldForError($enterID_field, '#5c5c5c', 'Invalid ID:  ' + fieldValue);
                });
        }
        else {
            flashFieldForError($enterID_field, '#5c5c5c', 'Enter a cloud ID');
        }
    }


    function showErrorMessageForNearByClouds(message) {
        $nearClouds.append('<p>' + message + '</p>');
    }
}


// ===================================================================================================


function CreateNewCloudOptions() {

    var self = this,
        $createOptions = $('#createOptions'),
        $createNameField = $('#createName', $createOptions),
        $createName_go_button = $('#createName_go', $createOptions).click(createNewCloudHandler);


    var broadcastSliderButton = new ButtonSlider('broadcast', 'Public', 'Private');
    (function initBroadcastStateFn() {
        $.when(getCurrentLocation())
            .done(broadcastSliderButton.toggleOn)
            .fail(function () {
                broadcastSliderButton.disable(disabledBroadcastButtonHandler)
            });

        function disabledBroadcastButtonHandler() {
            var $error = $('#broadcastError');
            $error.stop(true).fadeIn(STD_ANIMATE_TIME).promise().done(function () {
                setTimeout(function () {
                    $error.fadeOut(2000)
                }, 2000);
            });
        }
    }());


    self.toggleInto = function() {
        $createOptions.fadeIn(STD_ANIMATE_TIME, function () {
            $createNameField.focus();
        });
    };

    self.toggleAway = function(callback) {
        $createOptions.fadeOut(STD_ANIMATE_TIME, callback);
    };


    function createNewCloudHandler() {
        if ($createNameField.val()) {
            disableCreateOptions();
            setupNewCloud();

        }
        else {
            flashFieldForError($createNameField, 'white');
        }

        function setupNewCloud() {
            var isPublic  = broadcastSliderButton.isOn,
                cloudName = getEscapedCloudName();

            if (isPublic) {
                $.when(getCurrentLocation()).then(setup);
            } else {
                setup();
            }

            function setup(location) {
                Meteor.call('createCloud', cloudName, isPublic, location, function(error, cloudId) {
                    loadAppWithParams(cloudId, cloudName, true);
                });
            }
        }

        function getEscapedCloudName() {
            return $createNameField.val().toLowerCase().replace(/ +/g, '_').replace(/[0-9]/g, '').replace(/[^a-z0-9-_]/g, '').trim();
        }
    }


    function disableCreateOptions() {
        $createNameField.prop('disabled', true).css('opacity', '0.7');
        $createName_go_button.addClass('loadingNewCloud').off();
        broadcastSliderButton.disable();
    }
}



// ============================ Helper Functions ===================================

function flashFieldForError($input, fadeBackToColor, message) {
    $input.stop(true).animate({'background-color': 'red'}, 25).animate({'background-color': fadeBackToColor}, 1000);
    if (message) {
        $input.attr({placeholder: message});
    }
}

function loadAppWithParams(cloudId, name, isOwner) {
    Meteor.call('ensureCloudUserData', Meteor.userId(), cloudId, isOwner, function() {
        Router.go('app', { cloudId: cloudId });
    });
}

function getCurrentLocation() {
    var defer = $.Deferred(),
        data = {},
        locationOptions = { enableHighAccuracy: true, timeout: 10000000, maximumAge: 0 };

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(success, error, locationOptions);
    }
    else {
        showErrorMessageForNearByClouds("Your Browser Doesn't support Geolocation");
    }

    function success(position) {
        data.lat = position.coords.latitude;
        data.long = position.coords.longitude;
        data.accuracy = getSearchRadiusFromClientAccuracy(position.coords.accuracy);
        defer.resolve(data);
    }

    function error(error) {
        var e;
        switch (error.code) {
            case error.PERMISSION_DENIED:
                e = "User denied the request for Geolocation";
                break;
            case error.POSITION_UNAVAILABLE:
                e = "Location information is unavailable";
                break;
            case error.TIMEOUT:
                e = "The request to get user location timed out"
                break;
            default:
                e = "An unknown error occurred :(";
                break;
        }
        defer.reject(e);
    }

    return defer;
}

function getSearchRadiusFromClientAccuracy(accuracy_in_meters) {
    var MAX_INACCURACY_RADIUS_MILES = 0.8,
        accuracy_in_miles = accuracy_in_meters / 1609.34;
    return accuracy_in_miles >= MAX_INACCURACY_RADIUS_MILES ? MAX_INACCURACY_RADIUS_MILES : accuracy_in_miles;
}


function verifyCloudID(id) {
    var defer = $.Deferred();

    Meteor.call('findCloud', id, function (error, cloud) {
        cloud ? defer.resolve(cloud) : defer.reject();
    });

    return defer;
}


// ==========================================================================================
// ============================ Security Locking For Beta ===================================
// function checkLock() {
//     function getLockState() {
//         var path = 'http://johnthomasmccormack.com/HOST/cloudlist/';
//         var getUrl = path + 'secureCheck.php?isLocked=isLocked';
//         return $.getJSON(getUrl);
//     }

//     return getLockState().done(function (data) {
//         if (data.isLocked == 1) {
//             window.location.href = "/denied.html";
//         }
//     });
// }
// checkLock();
// setInterval(checkLock, 10000);