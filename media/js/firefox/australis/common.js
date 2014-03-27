;(function($, Mozilla) {
    'use strict';

    var pageId = $('body').prop('id');
    var firstTime = 'True';
    var $window = $(window);

    // scroll to top of window for mask overlay
    if ($window.scrollTop() > 0 && (window.location.hash !== '#footer-email-form')) {
        $window.scrollTop(0);
    }

    // Highlight sync in the app menu and track cta click
    function showSyncInMenu (e) {
        e.preventDefault();
        e.stopPropagation();
        Mozilla.UITour.showHighlight('accountStatus', 'wobble');

        // hide app menu when user clicks anywhere on the page
        $(document.body).one('click', function () {
            Mozilla.UITour.hideHighlight();
        });

        gaTrack(['_trackEvent', pageId + ' Page Interactions - New Firefox Tour', 'button click', 'Get Started with Sync']);
    }

    // Open learn more links in new window and track
    function trackLearnMoreLinks (e) {
        e.preventDefault();
        var url = this.href;
        window.open(url, '_blank');
        gaTrack(['_trackEvent', pageId + ' Page Interactions - New Firefox Tour', 'link click', url]);
    }

    // show sync animation when user scrolls down past header
    $('.main-header').waypoint(function(direction) {
        if (direction === 'down') {
            syncAnimation();
        }
    }, {
        triggerOnce: true,
        offset: -100
    });

    function syncAnimation () {
        var $syncAnim = $('.sync-anim');
        var $laptop = $syncAnim.find('.laptop');
        var $laptopScreen = $laptop.find('.inner');
        var $phone = $syncAnim.find('.phone');
        var $arrows = $laptop.find('.arrows');

        $syncAnim.addClass('on');

        $arrows.one('animationstart', function () {
            $laptopScreen.addClass('faded');
        });

        $arrows.one('animationend', function () {
            $laptopScreen.removeClass('faded');
        });

        $phone.one('animationend', '.passwords', function () {
            $syncAnim.addClass('complete');
        });
    }

    //Only highlight sync for Firefox Desktop 29 or greater.
    if (window.isFirefox() && !window.isFirefoxMobile() && window.getFirefoxMasterVersion() >= 29) {
        Mozilla.UITour.getConfiguration('sync', function (config) {
            var $cta = $('.sync-cta');
            var $alt = $('.sync-alt');

            if (config.setup === false) {
                // Show CTA if the user does not already have Sync
                $cta.show();
                $cta.find('button').on('click', showSyncInMenu);
            } else if (config.setup === true) {
                // If already using Sync show fallback messaging
                $alt.show();
            }
        });
    }

    // track learn more links on click
    $('.learn-more a').on('click', trackLearnMoreLinks);

    //track if this is the first time a user has seen any tour (firstrun or whatsnew)
    try {
        if (localStorage.getItem('mozUITourGlobalFlag') === 'taken') {
            firstTime = 'False';
        } else {
            localStorage.setItem('mozUITourGlobalFlag', 'taken');
        }
        gaTrack(['_trackEvent', 'Tour Interaction', 'First Time Seeing Tour', firstTime, 0, true]);
    } catch (e) {}

})(window.jQuery, window.Mozilla);
