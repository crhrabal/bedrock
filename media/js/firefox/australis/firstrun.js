;(function($, Mozilla) {
    'use strict';

    // if user has submitted newsletter don't show the tour again
    if (window.location.hash === '#footer-email-form') {
        return;
    }

    //Only run the tour if user is on Firefox 29 for desktop.
    if (window.isFirefox() && !window.isFirefoxMobile() && window.getFirefoxMasterVersion() >= 29) {

        // add a callback when user finishes tour to update the cta
        // id is used for Telemetry
        var tour = new Mozilla.BrowserTour({
            id: 'australis-tour-firstrun-29-release'
        });

        tour.init();
    }

})(window.jQuery, window.Mozilla);
