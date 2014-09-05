/*!
 * @name fly
 * @version v0.0.3
 * @author Artur Burtsev <artjock@gmail.com>
 * @see https://github.com/artjock/fly
 */
;(function() {

/**
 * Wrapper
 */
var fly = {
    /**
     * Instances count
     * @private
     * @type Number
     */
    _count: 0,

    /**
     * Mixins collection
     * @private
     * @type Object
     */
    _mixin: {}
};



fly._base = {

    /**
     * Avaliable events
     * @enum
     */
    events: {
        hide: 'hide',
        show: 'show',
        rootready: 'rootready'
    },

    /**
     * Shared constructor
     * @private
     * @type Function
     */
    _ctor: function fly_ctor() {},

    /**
     * DOM root
     * @type jQuery
     * @private
     */
    _$root: null,


    /**
     * Event emmiter
     * @type jQuery
     */
    _emmiter: null,

    /**
     * Open/close trigger
     * @type jQuery
     */
    $handle: null,

    /**
     * Default class options
     * @param Object
     * @private
     * @static
     */
    defaults: {
        content: '',
        redrawOnShow: true
    },

    /**
     * Events namespace
     * @type String
     */
    ens: '',

    /**
     * Options
     * @param Object
     */
    options: null,



    /**
     * Creates instance of fly
     * @param {jQuery} handle
     * @param {Object} options
     * @static
     * @return fly
     */
    create: function(handle, options) {

        var inst = this.extend({
            ens: '.ns' + fly._count++,
            $handle: $(handle),
            _emmiter: $({})
        });

        inst.options = $.extend({}, inst.defaults, options);

        return inst._init();
    },

    /**
     * Extends fly's class and returns new one
     * @param {Object} extra
     * @static
     * @return fly
     */
    extend: function(extra) {
        this._ctor.prototype = this;

        if (extra && 'defaults' in extra) {
            extra.defaults =
                $.extend({}, this.defaults, extra.defaults);
        }

        return $.extend(new this._ctor(), extra);
    },

    /**
     * Lazy fly's getter
     * @return jQuery
     */
    root: function() {

        if (!this._$root) {
            var opt = this.options;

            this._$root = $('<div/>')
                .addClass(opt.baseClass)
                .addClass(opt.extraClass)
                .addClass(opt.hideClass)
                .appendTo('body');

            this.trigger(this.events.rootready);
        }

        return this._$root;
    },

    /**
     * Initializes fly
     * @private
     * @return fly
     */
    _init: function() {
        this._action(true);
        this.init();
        return this;
    },

    /**
     * Cleans up fly
     */
    _destroy: function() {
        this.destroy();

        if (this._$root) {
            this._$root.remove();
            this._$root = null;
        }
        this._action(false);
    },

    /**
     * Binds action to $handle
     * @abstract
     * @private
     */
    _action: function(mode) {
        var actions = this.actions;

        for (var type in actions) {

            if (mode) {
                this.$handle.bind(type + this.ens, this._actionHandler(type));
            } else {
                this.$handle.unbind(type + this.ens);
            }

        }
    },

    _actionHandler: function(type) {
        var action = this.actions[type];
        return typeof action === 'string' ?
            $.proxy(this[action], this) : $.proxy(action, this);
    },

    /**
     * Calculates content and run callback *
     * @private
     * @param {Function} done
     */
    _content: function(done) {
        var content = this.options.content;

        if (typeof content === 'function') {
            if (content.length) {
                content.call(this, done);
            } else {
                done( content.call(this) );
            }
        } else {
            done( content );
        }
    },

    /**
     * Fills root element with content
     *
     * @param {String} content
     */
    _render: function(content) {
        this.root()
            .html(content || '');
        this._rendered = true;
    },

    /**
     * Generates CSS classes for current position options
     */
    _modCss: function() {
        var mod = this.options.position.split(' ');
        var base = this.options.baseClass;

        return [base + '_' + mod[0], base + '_arrow-' + mod[1]].join(' ');
    },

    /**
     * Calculates fly's position
     * @abstract
     * @private
     */
    _position: function() {},

    /**
     * Public init, should be overwritten
     * @abstract
     */
    init: function() {},

    /**
     * Public destroy, Should be overwritten
     * @abstract
     */
    destroy: function() {},

    /**
     * Shows fly
     *
     * If you will pass a content, it will force rendering
     *
     * @param {HTMLElement|String} content
     */
    show: function(content) {
        var redraw = this.options.redrawOnShow || !this._rendered;

        if (redraw && !arguments.length) {
            return this._content( $.proxy(this.show, this) );
        }

        if (arguments.length) {
            this._render(content);
        }

        this.trigger(this.events.show);

        this.root()
            .css( this._position() )
            .addClass( this._modCss() )
            .removeClass( this.options.hideClass );
    },

    /**
     * Hides fly
     */
    hide: function() {
        if (this.hidden()) { return; }

        this.trigger(this.events.hide);

        this.root()
            .addClass(this.options.hideClass);
    },

    /**
     * Toggles visibility of the fly
     */
    toggle: function() {
        this[this.hidden() ? 'show' : 'hide']();
    },

    /**
     * Returns true if element is hidden
     * @return Boolean
     */
    hidden: function() {
        return !this._$root || this.root().hasClass(this.options.hideClass);
    }
};


/**
* Adds jquery events support
*/
$.each(['bind', 'unbind', 'one', 'trigger'], function(i, type) {
    fly._base[type] = function() {
        this._emmiter[type].apply(this._emmiter, arguments);
        return this;
    };
});



/**
 * Calculates dimentions of DOM element
 *
 * @mixin
 *
 * @type Object
 * @property {Number} top
 * @property {Number} left
 * @property {Number} right
 * @property {Number} bottom
 * @property {Number} width
 * @property {Number} height
 */
fly._mixin.rect = function($el) {
    var rect = $el[0].getBoundingClientRect();

    // IE
    if ( !('width' in rect) ) {
        rect = $.extend({}, rect);
        rect.width = $el.outerWidth();
        rect.height = $el.outerHeight();
    }

    return rect;
};


/**
 * Calculates fly position depending on handle
 *
 * @requires mixin.rect
 * @mixin
 * @type Object
 * @property {Number} top
 * @property {Number} left
 */
fly._mixin.position = function() {
    var css = {};

    var $w = $(window);
    var pos = this.options.position.split(' ');
    var arr = this.options.arrowSize;

    var popover = pos.shift();
    var arrow = pos.shift();

    var a = {};
    var h = this._rect( this.$handle );
    var d = this._rect( this.root() );
    var s = {top: $w.scrollTop(), left: $w.scrollLeft()};

    switch (arrow) {
        case 'top':     a.top = h.height / 2 - arr * 1.5; break;
        case 'left':    a.left = h.width / 2 - arr * 1.5; break;
        case 'right':   a.left = h.width / 2 - d.width + arr * 1.5; break;
        case 'bottom':  a.top = h.height / 2 - d.height + arr * 1.5; break;
        default /*center*/:
            a.top = (h.height - d.height) / 2;
            a.left = (h.width - d.width) / 2;
            break;
    }

    switch (popover) {
        case 'left':
            css.top = s.top + h.top + a.top;
            css.left = s.left + h.left - d.width - arr;
            break;
        case 'right':
            css.top = s.top + h.top + a.top;
            css.left = s.left + h.left + h.width + arr;
            break;
        case 'top':
            css.top = s.top + h.top - d.height - arr;
            css.left = s.left + h.left + a.left;
            break;
        default /*bottom*/:
            css.top = s.top + h.top + h.height + arr;
            css.left = s.left + h.left + a.left;
    }

    return css;
};


/**
 * Tooltip
 *
 * @requires fly._base
 * @requires mixin.position
 *
 * @extends fly._base
 */
fly.tooltip = fly._base.extend({

    actions: {
        'mouseenter': '_actionMouseenter',
        'mouseleave': '_actionMouseleave'
    },

    _timeout: null,

    _actionMouseenter: function() {
        var that = this;
        this._timeout = setTimeout(function() {
            that.show();
        }, this.options.delay);
    },

    _actionMouseleave: function() {
        if (this._timeout) {
            clearTimeout(this._timeout);
        }
        this.hide();
    },

    /**
     * Deafult settings for tooltip
     * @type Object
     */
    defaults: {
        baseClass: 'fly-tooltip',
        hideClass: 'fly-tooltip_hidden',
        extraClass: '',

        position: 'bottom center',
        arrowSize: 10,
        delay: 300
    },

    _rect: fly._mixin.rect,
    _position: fly._mixin.position
});


/**
 * Dropdown
 *
 * @requires fly._base
 * @requires mixin.position
 *
 * @extends fly._base
 */
fly.dropdown = fly._base.extend({

    actions: {
        'click': '_actionClick'
    },

    /**
     * Bind action helper
     * @private
     */
    _actionClick: function() {
        var that = this;
        var $root = this.root();
        var $handle = this.$handle;

        if ( !this.hidden() ) {
            return this.hide();
        }

        this.one(that.events.hide, function() {
            $(document).unbind( 'click' + that.ens + ' keydown' + that.ens );
        });

        $(document)
            .bind('click' + that.ens, function(evt) {
                var target = evt.target;
                if ( out($root, target) && out($handle, target) ) {
                    that.hide();
                }
            })
            .bind('keydown' + that.ens, function(evt) {
                if (evt.which === 27) { that.hide(); }
            });

        this.show();

        function out($root, el) {
            return $root[0] !== el && !$.contains($root[0], el);
        }
    },

    /**
     * Deafult settings for dropdown
     * @type Object
     */
    defaults: {
        baseClass: 'fly-dropdown',
        hideClass: 'fly-dropdown_hidden',
        extraClass: '',

        position: 'bottom center',
        arrowSize: 10
    },

    _rect: fly._mixin.rect,
    _position: fly._mixin.position
});



/**
 * jQuery extension for dropdown
 *
 * @requires _base.js
 */

$.fly = fly;

$.each(fly, function(type, component) {
    if ( component === fly._base || !(component instanceof fly._base._ctor) ) {
        return;
    }

    var expando = 'fly_' + type + '_' + (+new Date());

    $.fn[ type ] = function(options) {

        return this.each(function(i, $this) {
            var $el = $(this);
            var old = $el.data(expando);

            switch (options) {

                case 'instance': return old;
                case 'destroy': destroy(old); break;
                default:
                    destroy(old);
                    $el.data(expando, component.create($el, options));
            }
        });

        function destroy(component) {
            if (component) {
                component.$handle.removeData(expando);
                component._destroy();
            }
        }
    };
});

})();