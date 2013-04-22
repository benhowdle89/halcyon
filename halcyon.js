var infinite = infinite || (function(win, doc) {

    var cache = {},
    initialize = function(opts) {

        if (!opts.element) {
            throw new Error('You must provide a DOM element');
        }
        cache.element = opts.element;
        cache.easing = opts.easing || 'ease-in-out';
        cache.speed = opts.speed + 's' || '0.5s';
        cache.interval = opts.interval || 2000;

        var wrapper = cache.element.children[0],
            ul = wrapper.children[0],
            firstLI = ul.children[0];

        ul.appendChild(firstLI.cloneNode(true));

        cache.numSlides = ul.children.length;
        cache.sliderWidth = parseInt(win.getComputedStyle(firstLI).width, 10);
        cache.wrapper = wrapper;
        cache.currentSlide = 1;

        _slides.next();
        utils.transition.on();
        cache.sliderInterval = win.setInterval(_slides.next, cache.interval);
    },
    utils = {
        transition: {
            on: function() {
                cache.wrapper.style.webkitTransitionDuration = cache.speed;
                cache.wrapper.style.webkitTransitionTimingFunction = cache.easing;
            },
            off: function() {
                cache.wrapper.style.webkitTransitionDuration = '';
                cache.wrapper.style.webkitTransitionTimingFunction = '';
            }
        }
    },
    _slides = {
        next: function() {
            if ((cache.currentSlide) == cache.numSlides) {

                // We need to reset. Do this halfway through interval
                setTimeout(function() {
                    utils.transition.off();
                    cache.currentSlide = 2;
                    cache.wrapper.style.webkitTransform = "translate3d(0, 0, 0)";
                    setTimeout(utils.transition.on, 0);
                }, (cache.interval / 2));
            }

            var newL = (cache.currentSlide - 1) * cache.sliderWidth;
            cache.wrapper.style.webkitTransform = "translate3d(-" + (newL) + "px, 0, 0)";
            cache.currentSlide++;
        }
    };

    return {
        init: initialize
    };

})(window, document);

infinite.init({
    element: document.getElementById('my-carousel'),
    easing: 'ease-in-out',
    speed: 0.5,
    interval: 2000
});