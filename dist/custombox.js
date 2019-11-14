var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Custombox;
(function (Custombox) {
    // Values
    var CB = 'custombox';
    var OPEN = CB + "-open";
    var CLOSE = CB + "-close";
    var LOCK = CB + "-lock";
    var FROM = 'animateFrom';
    var BLOCK = 'block';
    var positionValues = ['top', 'right', 'bottom', 'left'];
    // Effects
    var animationValues = ['slide', 'blur', 'flip', 'rotate', 'letmein', 'makeway', 'slip', 'corner', 'slidetogether', 'push', 'contentscale'];
    var containerValues = ['blur', 'makeway', 'slip', 'push', 'contentscale'];
    var overlayValues = ['letmein', 'makeway', 'slip', 'corner', 'slidetogether', 'door', 'push', 'contentscale'];
    var together = ['corner', 'slidetogether', 'scale', 'door', 'push', 'contentscale'];
    var perspective = ['fall', 'sidefall', 'flip', 'sign', 'slit', 'letmein', 'makeway', 'slip'];
    var Snippet = /** @class */ (function () {
        function Snippet() {
        }
        Snippet.check = function (values, match) {
            return values.indexOf(match) > -1;
        };
        Snippet.isIE = function () {
            var ua = window.navigator.userAgent;
            var msie = ua.indexOf('MSIE ');
            if (msie > 0) {
                // IE 10 or older => return version number
                return !isNaN(parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10));
            }
            var trident = ua.indexOf('Trident/');
            if (trident > 0) {
                // IE 11 => return version number
                var rv = ua.indexOf('rv:');
                return !isNaN(parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10));
            }
            var edge = ua.indexOf('Edge/');
            if (edge > 0) {
                // Edge (IE 12+) => return version number
                return !isNaN(parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10));
            }
            // other browser
            return false;
        };
        return Snippet;
    }());
    var Scroll = /** @class */ (function () {
        function Scroll() {
            this.position = document.documentElement && document.documentElement.scrollTop || document.body && document.body.scrollTop || 0;
            document.documentElement.classList.add(CB + "-perspective");
        }
        // Public methods
        Scroll.prototype.remove = function () {
            document.documentElement.classList.remove(CB + "-perspective");
            window.scrollTo(0, this.position);
        };
        return Scroll;
    }());
    var DefaultSchema = /** @class */ (function () {
        function DefaultSchema() {
            this.overlay = {
                color: '#000',
                opacity: .48,
                close: true,
                speedIn: 300,
                speedOut: 300,
                onOpen: null,
                onComplete: null,
                onClose: null,
                active: true,
            };
            this.content = {
                id: null,
                target: null,
                container: null,
                clone: false,
                animateFrom: 'top',
                animateTo: 'top',
                positionX: 'center',
                positionY: 'center',
                width: null,
                effect: 'fadein',
                speedIn: 300,
                speedOut: 300,
                delay: 150,
                fullscreen: false,
                onOpen: null,
                onComplete: null,
                onClose: null,
                close: true,
            };
            this.loader = {
                active: true,
                color: '#FFF',
                background: '#999',
                speed: 1000,
            };
        }
        return DefaultSchema;
    }());
    var Options = /** @class */ (function (_super) {
        __extends(Options, _super);
        function Options(options) {
            var _this = _super.call(this) || this;
            Object.keys(_this).forEach(function (key) {
                if (options[key]) {
                    Object.assign(_this[key], options[key]);
                }
            });
            return _this;
        }
        return Options;
    }(DefaultSchema));
    var Loader = /** @class */ (function () {
        function Loader(options) {
            this.options = options;
            this.element = document.createElement('div');
            this.element.classList.add(CB + "-loader");
            this.element.style.borderColor = this.options.loader.background;
            this.element.style.borderTopColor = this.options.loader.color;
            this.element.style.animationDuration = this.options.loader.speed + "ms";
            document.body.appendChild(this.element);
        }
        // Public methods
        Loader.prototype.show = function () {
            this.element.style.display = BLOCK;
        };
        Loader.prototype.destroy = function () {
            this.element.parentElement.removeChild(this.element);
        };
        return Loader;
    }());
    var Container = /** @class */ (function () {
        function Container(options) {
            this.options = options;
            if (document.readyState === 'loading') {
                throw new Error('You need to instantiate Custombox when the document is fully loaded');
            }
            var selector = document.querySelector(this.options.content.container);
            if (selector) {
                this.element = selector;
            }
            else if (!document.querySelector("." + CB + "-container")) {
                this.element = document.createElement('div');
                while (document.body.firstChild) {
                    this.element.appendChild(document.body.firstChild);
                }
                document.body.appendChild(this.element);
            }
            else if (document.querySelector("." + CB + "-container")) {
                this.element = document.querySelector("." + CB + "-container");
            }
            this.element.classList.add(CB + "-container");
            this.element.classList.add(CB + "-" + this.options.content.effect);
            this.element.style.animationDuration = this.options.content.speedIn + "ms";
            if (Snippet.check(animationValues, this.options.content.effect)) {
                this.setAnimation();
            }
        }
        // Public methods
        Container.prototype.bind = function (method) {
            var _this = this;
            if (method === CLOSE) {
                if (Snippet.check(animationValues, this.options.content.effect)) {
                    this.setAnimation('animateTo');
                }
                this.element.classList.remove(OPEN);
            }
            this.element.classList.add(method);
            return new Promise(function (resolve) { return _this.listener().then(function () { return resolve(); }); });
        };
        Container.prototype.remove = function () {
            this.element.classList.remove(CLOSE);
            this.element.classList.remove(CB + "-" + this.options.content.effect);
            this.element.style.removeProperty('animation-duration');
            var elements = document.querySelectorAll("." + CB + "-content");
            var container = document.querySelector(this.options.content.container);
            if (!elements.length) {
                if (container) {
                    var classes = this.element.className.split(' ');
                    for (var i = 0, t = classes.length; i < t; i++) {
                        if (classes[i].startsWith(CB + "-")) {
                            this.element.classList.remove(classes[i]);
                        }
                    }
                }
                else {
                    var container_1 = document.querySelector("." + CB + "-container");
                    while (container_1.firstChild)
                        container_1.parentNode.insertBefore(container_1.firstChild, container_1);
                    container_1.parentNode.removeChild(container_1);
                }
            }
        };
        // Private methods
        Container.prototype.listener = function () {
            var _this = this;
            return new Promise(function (resolve) {
                if (!Snippet.isIE()) {
                    _this.element.addEventListener('animationend', function () { return resolve(); }, true);
                }
                else {
                    setTimeout(resolve, _this.options.content.speedIn);
                }
            });
        };
        Container.prototype.setAnimation = function (action) {
            if (action === void 0) { action = FROM; }
            for (var i = 0, t = positionValues.length; i < t; i++) {
                if (this.element.classList.contains(CB + "-" + positionValues[i])) {
                    this.element.classList.remove(CB + "-" + positionValues[i]);
                }
            }
            this.element.classList.add(CB + "-" + this.options.content[action]);
        };
        return Container;
    }());
    var Overlay = /** @class */ (function () {
        function Overlay(options) {
            this.options = options;
            this.element = document.createElement('div');
            this.element.style.backgroundColor = this.options.overlay.color;
            this.element.classList.add(CB + "-overlay");
            this.setAnimation();
        }
        // Public methods
        Overlay.prototype.bind = function (method) {
            var _this = this;
            switch (method) {
                case CLOSE:
                    if (Snippet.check(overlayValues, this.options.content.effect)) {
                        this.toggleAnimation('animateTo');
                    }
                    this.element.classList.add(CLOSE);
                    this.element.classList.remove(OPEN);
                    break;
                default:
                    // Append
                    document.body.appendChild(this.element);
                    // Initialization
                    this.element.classList.add(CB + "-" + this.options.content.effect);
                    this.element.classList.add(OPEN);
                    break;
            }
            return new Promise(function (resolve) { return _this.listener().then(function () { return resolve(); }); });
        };
        Overlay.prototype.remove = function () {
            try {
                this.element.parentNode.removeChild(this.element);
                this.style.parentNode.removeChild(this.style);
            }
            catch (e) { }
        };
        // Private methods
        Overlay.prototype.createSheet = function () {
            this.style = document.createElement('style');
            this.style.setAttribute('id', CB + "-overlay-" + Date.now());
            document.head.appendChild(this.style);
            return this.style.sheet;
        };
        Overlay.prototype.listener = function () {
            var _this = this;
            return new Promise(function (resolve) {
                if (!Snippet.isIE()) {
                    _this.element.addEventListener('animationend', function () { return resolve(); }, true);
                }
                else {
                    setTimeout(resolve, _this.options.overlay.speedIn);
                }
            });
        };
        Overlay.prototype.setAnimation = function () {
            var sheet = this.createSheet();
            if (Snippet.check(overlayValues, this.options.content.effect)) {
                this.element.style.opacity = this.options.overlay.opacity.toString();
                this.element.style.animationDuration = this.options.overlay.speedIn + "ms";
                this.toggleAnimation();
            }
            else {
                sheet.insertRule("." + CB + "-overlay { animation: CloseFade " + this.options.overlay.speedOut + "ms; }", 0);
                sheet.insertRule("." + OPEN + "." + CB + "-overlay { animation: OpenFade " + this.options.overlay.speedIn + "ms; opacity: " + this.options.overlay.opacity + " }", 0);
                sheet.insertRule("@keyframes OpenFade { from {opacity: 0} to {opacity: " + this.options.overlay.opacity + "} }", 0);
                sheet.insertRule("@keyframes CloseFade { from {opacity: " + this.options.overlay.opacity + "} to {opacity: 0} }", 0);
            }
            if (Snippet.check(together, this.options.content.effect)) {
                var duration = this.options.overlay.speedIn;
                if (Snippet.check(together, this.options.content.effect)) {
                    duration = this.options.content.speedIn;
                }
                this.element.style.animationDuration = duration + "ms";
            }
        };
        Overlay.prototype.toggleAnimation = function (action) {
            if (action === void 0) { action = FROM; }
            for (var i = 0, t = positionValues.length; i < t; i++) {
                if (this.element.classList.contains(CB + "-" + positionValues[i])) {
                    this.element.classList.remove(CB + "-" + positionValues[i]);
                }
            }
            this.element.classList.add(CB + "-" + this.options.content[action]);
        };
        return Overlay;
    }());
    var Content = /** @class */ (function () {
        function Content(options) {
            this.options = options;
            this.element = document.createElement('div');
            this.element.style.animationDuration = this.options.content.speedIn + "ms";
            if (this.options.content.id) {
                this.element.setAttribute('id', CB + "-" + this.options.content.id);
            }
            if (!Snippet.check(together, this.options.content.effect)) {
                this.element.style.animationDelay = this.options.content.delay + "ms";
            }
            this.element.classList.add(CB + "-content");
            // Check fullscreen
            if (this.options.content.fullscreen) {
                this.element.classList.add(CB + "-fullscreen");
            }
            else {
                this.element.classList.add(CB + "-x-" + this.options.content.positionX);
                this.element.classList.add(CB + "-y-" + this.options.content.positionY);
            }
            if (Snippet.check(animationValues, this.options.content.effect)) {
                this.setAnimation();
            }
        }
        // Public methods
        Content.prototype.fetch = function () {
            var _this = this;
            return new Promise(function (resolve, reject) {
                // Youtube
                var regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
                var match = _this.options.content.target.match(regExp);
                if (match && match[2].length == 11) {
                    var element = document.createElement('div');
                    var frame = document.createElement('iframe');
                    frame.setAttribute('src', "https://www.youtube.com/embed/" + match[2]);
                    frame.setAttribute('frameborder', '0');
                    frame.setAttribute('allowfullscreen', '');
                    frame.setAttribute('width', '100%');
                    frame.setAttribute('height', '100%');
                    element.appendChild(frame);
                    if (!_this.options.content.fullscreen) {
                        var w = window.innerWidth > 560 ? 560 : window.innerWidth;
                        var h = window.innerHeight > 315 ? 315 : window.innerHeight;
                        var natural = parseInt(_this.options.content.width, 10);
                        if (_this.options.content.width && window.innerWidth > natural) {
                            h = Math.round(h * natural / w);
                            w = natural;
                        }
                        frame.setAttribute('width', w + "px");
                        frame.setAttribute('height', h + "px");
                    }
                    _this.element.appendChild(element);
                    resolve();
                }
                else if (_this.options.content.target.charAt(0) !== '#' && _this.options.content.target.charAt(0) !== '.') {
                    var req_1 = new XMLHttpRequest();
                    req_1.open('GET', _this.options.content.target);
                    req_1.onload = function () {
                        if (req_1.status === 200) {
                            _this.element.insertAdjacentHTML('beforeend', req_1.response);
                            var child = _this.element.firstChild;
                            // Set visible
                            try {
                                child.style.display = BLOCK;
                            }
                            catch (e) {
                                reject(new Error('The ajax response need a wrapper element'));
                            }
                            if (_this.options.content.width) {
                                child.style.flexBasis = _this.options.content.width;
                            }
                            resolve();
                        }
                        else {
                            reject(new Error(req_1.statusText));
                        }
                    };
                    req_1.onerror = function () { return reject(new Error('Network error')); };
                    req_1.send();
                }
                else {
                    // Selector
                    var selector = document.querySelector(_this.options.content.target);
                    if (selector) {
                        if (_this.options.content.clone) {
                            selector = selector.cloneNode(true);
                            selector.removeAttribute('id');
                        }
                        else {
                            _this.reference = document.createElement('div');
                            _this.reference.classList.add(CB + "-reference");
                            _this.reference.setAttribute('style', selector.getAttribute('style'));
                            selector.parentNode.insertBefore(_this.reference, selector.nextSibling);
                        }
                        // Set visible
                        selector.style.display = BLOCK;
                        // Set width
                        if (_this.options.content.width) {
                            selector.style.flexBasis = _this.options.content.width;
                        }
                        _this.element.appendChild(selector);
                        resolve();
                    }
                    else {
                        reject(new Error("The element doesn't exist"));
                    }
                }
            });
        };
        Content.prototype.bind = function (method) {
            var _this = this;
            switch (method) {
                case CLOSE:
                    this.element.style.animationDelay = '0ms';
                    this.element.style.animationDuration = this.options.content.speedOut + "ms";
                    this.element.classList.remove(OPEN);
                    this.element.classList.add(CLOSE);
                    this.setAnimation('animateTo');
                    break;
                default:
                    // Append
                    document.body.appendChild(this.element);
                    // Initialization
                    this.element.classList.add(CB + "-" + this.options.content.effect);
                    this.element.classList.add(OPEN);
                    break;
            }
            return new Promise(function (resolve) { return _this.listener().then(function () { return resolve(); }); });
        };
        Content.prototype.remove = function () {
            var match = new RegExp('^[#|.]');
            if (!this.options.content.clone && match.test(this.options.content.target)) {
                var element = this.element.childNodes[0];
                element.setAttribute('style', this.reference.getAttribute('style'));
                this.reference.parentNode.insertBefore(this.element.childNodes[0], this.reference.nextSibling);
                this.reference.parentNode.removeChild(this.reference);
            }
            try {
                this.element.parentNode.removeChild(this.element);
            }
            catch (e) { }
        };
        // Private methods
        Content.prototype.listener = function () {
            var _this = this;
            return new Promise(function (resolve) {
                if (!Snippet.isIE()) {
                    _this.element.addEventListener('animationend', function () { return resolve(); }, true);
                }
                else {
                    setTimeout(resolve, _this.options.content.speedIn);
                }
            });
        };
        Content.prototype.setAnimation = function (action) {
            if (action === void 0) { action = FROM; }
            for (var i = 0, t = positionValues.length; i < t; i++) {
                if (this.element.classList.contains(CB + "-" + positionValues[i])) {
                    this.element.classList.remove(CB + "-" + positionValues[i]);
                }
            }
            this.element.classList.add(CB + "-" + this.options.content[action]);
        };
        return Content;
    }());
    var modal = /** @class */ (function () {
        function modal(options) {
            this.action = function (event) {
                if (event.keyCode === 27) {
                    Custombox.modal.close();
                }
            };
            this.options = new Options(options);
        }
        // Public methods
        modal.prototype.open = function () {
            var _this = this;
            this.build();
            if (this.options.loader.active) {
                this.loader.show();
            }
            this.content
                .fetch()
                .then(function () {
                // Scroll
                if (Snippet.check(perspective, _this.options.content.effect)) {
                    _this.scroll = new Scroll();
                }
                // Overlay
                if (_this.options.overlay.active) {
                    _this.dispatchEvent('overlay.onOpen');
                    _this.overlay
                        .bind(OPEN)
                        .then(function () {
                        _this.dispatchEvent('overlay.onComplete');
                        if (_this.options.loader.active) {
                            _this.loader.destroy();
                        }
                    });
                }
                else if (_this.options.loader.active) {
                    _this.loader.destroy();
                }
                // Container
                if (_this.container) {
                    _this.container.bind(OPEN);
                }
                // Content
                document.body.classList.add(LOCK);
                _this.content.bind(OPEN).then(function () { return _this.dispatchEvent('content.onComplete'); });
                // Dispatch event
                _this.dispatchEvent('content.onOpen');
                // Listeners
                _this.listeners();
            })
                .catch(function (error) {
                if (_this.options.loader.active) {
                    _this.loader.destroy();
                }
                throw error;
            });
        };
        // Private methods
        modal.prototype.build = function () {
            // Create loader
            if (this.options.loader.active) {
                this.loader = new Loader(this.options);
            }
            // Create container
            if (Snippet.check(containerValues, this.options.content.effect)) {
                this.container = new Container(this.options);
            }
            // Create overlay
            if (this.options.overlay.active) {
                this.overlay = new Overlay(this.options);
            }
            // Create content
            this.content = new Content(this.options);
        };
        modal.close = function (id) {
            var event = new CustomEvent(CB + ":close");
            var elements = document.querySelectorAll("." + CB + "-content");
            if (id) {
                elements = document.querySelectorAll("#" + CB + "-" + id);
            }
            try {
                elements[elements.length - 1].dispatchEvent(event);
            }
            catch (e) {
                throw new Error('Custombox is not instantiated');
            }
        };
        modal.closeAll = function () {
            var event = new CustomEvent(CB + ":close");
            var elements = document.querySelectorAll("." + CB + "-content");
            var t = elements.length;
            for (var i = 0; i < t; i++) {
                elements[i].dispatchEvent(event);
            }
        };
        modal.prototype._close = function () {
            var _this = this;
            var close = [
                this.content.bind(CLOSE).then(function () { return _this.content.remove(); }),
            ];
            if (this.options.overlay.active) {
                close.push(this.overlay
                    .bind(CLOSE)
                    .then(function () {
                    if (_this.scroll) {
                        _this.scroll.remove();
                    }
                    _this.overlay.remove();
                    _this.dispatchEvent('overlay.onClose');
                }));
            }
            if (this.container) {
                close.push(this.container
                    .bind(CLOSE)
                    .then(function () { return _this.container.remove(); }));
            }
            Promise
                .all(close)
                .then(function () {
                if (_this.options.content.close) {
                    document.removeEventListener('keydown', _this.action, true);
                }
                _this.dispatchEvent('content.onClose');
                // Remove lock
                document.body.classList.remove(LOCK);
            });
        };
        // Private methods
        modal.prototype.dispatchEvent = function (type) {
            var element = type.replace('.on', ':').toLowerCase();
            var event = new CustomEvent(CB + ":" + element);
            var action = Object.create(this.options);
            document.dispatchEvent(event);
            try {
                type.split('.').reduce(function (a, b) { return a[b]; }, action).call();
            }
            catch (e) { }
        };
        modal.prototype.listeners = function () {
            var _this = this;
            var AFM = window.getComputedStyle(this.content.element).getPropertyValue('animation-fill-mode');
            document.addEventListener('fullscreenchange', function () {
                var style = window.getComputedStyle(_this.content.element);
                if (style.getPropertyValue('animation-fill-mode') === AFM) {
                    _this.content.element.style.animationFillMode = 'backwards';
                }
                else {
                    _this.content.element.style.animationFillMode = AFM;
                }
            }, true);
            if (this.options.content.close) {
                document.addEventListener('keydown', this.action, true);
            }
            if (this.options.overlay.close) {
                this.content.element.addEventListener('click', function (event) {
                    if (event.target === _this.content.element) {
                        _this._close();
                    }
                }, true);
            }
            this.content.element.addEventListener(CB + ":close", function () {
                _this._close();
            }, true);
        };
        return modal;
    }());
    Custombox.modal = modal;
})(Custombox || (Custombox = {}));
if (typeof (module) == 'object' && typeof (module.exports) == 'object') {
    module.exports = Custombox;
}
//# sourceMappingURL=custombox.js.map