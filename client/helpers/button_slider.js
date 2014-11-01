ButtonSlider = function(id, onText, OffText) {
    var self = this,
        $button = $('#' + id + '.slider-button'),
        $sliderHolder = $button.parent();
    self.toggleState = function(){$button.click()};
    self.isOn = false;
    initSetup();

    function initSetup() {
        $button.click(function(){
            if (self.isOn) {
                $button.removeClass('on').html(OffText);
            }
            else {
                $button.addClass('on').html(onText);
            }
            self.isOn = !self.isOn;
        });
    }

    self.toggleOn = function() {
        if (!self.isOn) {
            self.toggleState();
        }
    };

    self.toggleOff = function() {
        if (self.isOn) {
            self.toggleState();
        }
    };

    self.disable = function(disabledClickHandler) {
        $sliderHolder.animate({opacity: '0.4'}, 250);
        $button.css('cursor', 'auto').off();
        if (disabledClickHandler) {
            $button.click(disabledClickHandler);
        }
    };

    self.enable = function() {
        $sliderHolder.animate({opacity: '1'}, 250);
        $button.off();
        initSetup();
    }
};