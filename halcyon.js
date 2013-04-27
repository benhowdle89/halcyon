var Halcyon = Halcyon || (function(win, doc) {

    var cache = {}, applyCSS,
    initialize = function(opts) {
        if (!opts.element) {
            throw new Error('You must provide a DOM element');
        }
        cache.element = ((typeof jQuery !== 'undefined') && opts.element instanceof jQuery) ? opts.element[0] : opts.element;
        cache.controls = opts.controls || false;
        cache.easing = opts.easing || 'ease-in-out';
        cache.speed = opts.speed + 's' || '0.5s';
        cache.interval = opts.interval || 2000;
        cache.vendor = utils.vendor();

        cache.widths = function() {
            cache.sliderWidth = firstLI.getBoundingClientRect().width || firstLI.offsetWidth;
            var i = cache.wrapper.children.length;
            while (i--) {
                cache.wrapper.children[i].style.width = cache.sliderWidth + 'px';
            }
            cache.wrapper.style.width = cache.sliderWidth * cache.numSlides + 'px';
        };

        var vendors = ['moz', 'webkit', 'o', 'ms', ''];

        applyCSS = function(opts) {
            switch (opts.rule) {
                case 'timing':
                    opts.el.style[cache.vendor + 'TimingFunction'] = opts.value;
                    break;
                case 'duration':
                    opts.el.style[cache.vendor + 'TransitionDuration'] = opts.value;
                    break;
                case 'transform':
                    opts.el.style[cache.vendor + 'Transform'] = opts.value;
                    break;
            }
        };

        cache.wrapper = cache.element.querySelector('ul');
        var firstLI = cache.wrapper.children[0];

        cache.wrapper.appendChild(firstLI.cloneNode(true));
        cache.numSlides = cache.wrapper.children.length;

        cache.widths();

        cache.currentSlide = 1;

        setTimeout(function() {
            _slides.slide('next');
            utils.transition.on();
            cache.sliderInterval = win.setInterval(function() {
                _slides.slide('next');
            }, cache.interval);
        }, 0);

        window.addEventListener('resize', function() {
            cache.widths();
        }, false);

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
                    value: ""
                });
                applyCSS({
                    el: cache.wrapper,
                    rule: 'timing',
                    value: ""
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
        slide: function() {

            if ((cache.currentSlide) == cache.numSlides) {

                // We need to reset. Do this halfway through interval
                setTimeout(function() {
                    utils.transition.off();
                    setTimeout(function() {
                        cache.currentSlide = 2;
                        applyCSS({
                            el: cache.wrapper,
                            rule: 'transform',
                            value: "translate3d(0, 0, 0)"
                        });
                        setTimeout(utils.transition.on, ((cache.vendor == 'webkit') ? 0 : (cache.interval / 2)));
                    }, 0);
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
    easing: 'linear',
    speed: 0.5,
    interval: 2500
});