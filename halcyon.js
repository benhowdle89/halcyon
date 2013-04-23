var Halcyon = Halcyon || (function(win, doc) {

    var cache = {}, applyCSS,
    initialize = function(opts) {
        if (!opts.element) {
            throw new Error('You must provide a DOM element');
        }
        cache.element = opts.element;
        cache.easing = opts.easing || 'ease-in-out';
        cache.speed = opts.speed + 's' || '0.5s';
        cache.interval = opts.interval || 2000;
        cache.vendor = utils.vendor();

        var vendors = ['moz', 'webkit', 'o', 'ms', ''];

        applyCSS = function(opts) {
            switch (opts.rule) {
                case 'timing':
                    opts.el.style[cache.vendor+'TimingFunction'] = opts.value;
                    break;
                case 'duration':
                    opts.el.style[cache.vendor+'TransitionDuration'] = opts.value;
                    break;
                case 'transform':
                    opts.el.style[cache.vendor+'Transform'] = opts.value;
                    break;
            }
        };

        var wrapper = cache.element.children[0],
            ul = wrapper.children[0],
            firstLI = ul.children[0];

        ul.appendChild(firstLI.cloneNode(true));

        cache.numSlides = ul.children.length;
        cache.sliderWidth = firstLI.getBoundingClientRect().width || firstLI.offsetWidth;
        cache.wrapper = wrapper;
        cache.currentSlide = 1;

        _slides.next();
        utils.transition.on();
        cache.sliderInterval = win.setInterval(_slides.next, cache.interval);
    },
    utils = {
        transition: {
            on: function() {
                applyCSS({
                    el: cache.wrapper,
                    rule: 'duration',
                    value: cache.speed
                });
                applyCSS({
                    el: cache.wrapper,
                    rule: 'timing',
                    value: cache.easing
                });
            },
            off: function() {
                applyCSS({
                    el: cache.wrapper,
                    rule: 'duration',
                    value: 0
                });
                applyCSS({
                    el: cache.wrapper,
                    rule: 'timing',
                    value: 0
                });
            }
        },
        vendor: function() {
            var tmp = document.createElement("div"),
                prefixes = 'webkit Moz O ms'.split(' '),
                i;
            for (i in prefixes) {
                if (typeof tmp.style[prefixes[i] + 'Transition'] != 'undefined') {
                    return prefixes[i];
                }
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
                    applyCSS({
                        el: cache.wrapper,
                        rule: 'transform',
                        value: "translate3d(0, 0, 0)"
                    });
                    setTimeout(utils.transition.on, 0);
                }, (cache.interval / 2));
            }

            var newL = (cache.currentSlide - 1) * cache.sliderWidth;
            applyCSS({
                el: cache.wrapper,
                rule: 'transform',
                value: "translate3d(-" + (newL) + "px, 0, 0)"
            });
            cache.currentSlide++;
        }
    };

    return {
        init: initialize
    };

})(window, document);

Halcyon.init({
    element: document.getElementById('my-carousel'),
    easing: 'ease-in-out',
    speed: 0.5,
    interval: 2000
});