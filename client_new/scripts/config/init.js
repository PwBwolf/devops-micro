(function () {
    'use strict';

    var wndw_W = $(window).width();
    var wndw_H = $(window).height();

    function pickTransitionEvent() {
        var t;
        var elmt = document.createElement('fackelement');
        var transitions = {
            'transitions': 'transitionEnd',
            'OTransition': 'oTransitionEnd',
            'msTransition': 'MSTransitionEnd',
            'MozTransition': 'transitionend',
            'WebkitTransition': 'webkitTransitionEnd'
        };
        for (t in transitions) {
            if (elmt.style[t] !== undefined) {
                return transitions[t];
            }
        }
    }

    var transitionEnd = pickTransitionEvent();

    function bindEvent(el, eventName, eventHandler) {
        if (el.addEventListener) {
            el.addEventListener(eventName, eventHandler, false);
        } else if (el.attachEvent) {
            el.attachEvent('on' + eventName, eventHandler);
        }
    }

    bindEvent(document, 'DOMContentLoaded', function () {
        $('.ntwrkLogoBig').parallax('50%', 1.12);
        var navbar = document.getElementById('navBar');
        var brand = document.getElementById('brand');
        var navTop = navbar.offsetTop;
        var navLogo = brand.querySelector('img');
        var navdocked = false;
        $(dl).attr('style', 'display:none');
        $(dl_img).appendTo($(dl));
        $(hmBtn).attr('style', 'display:none');
        $('div[id="menuItems"]').prepend($(hmBtn)).prepend($(dl));

        window.onscroll = function () {

            if (!navdocked && (navbar.offsetTop - ascrollTop() < 0)) {
                navbar.style.top = 0;
                navbar.style.position = 'fixed';
                navbar.style.color = 'black';
                navbar.className = 'docked';
                navLogo.style.position = 'fixed';
                navLogo.className = 'imgdocked';
                $(hmBtn).show('slow');
                navdocked = true;
            } else if (navdocked && ascrollTop() <= navTop) {
                navbar.style.position = 'absolute';
                navLogo.style.position = 'absolute';
                navbar.style.top = navTop + 'px';
                navbar.style.color = '#3e194d';
                navbar.className = navbar.className.replace('docked', '');
                navLogo.className = navLogo.className.replace('imgdocked', '');
                navLogo.style.position = 'absolute';
                $(hmBtn).hide('slow');
                navdocked = false;
            }
        };
    });

    function ascrollTop() {
        return document.body.scrollTop || document.documentElement.scrollTop;
    }
})();
