/*!
 * @name fly
 * @version v0.0.0
 * @author Artur Burtsev <artjock@gmail.com>
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
    EVENTS: {
        HIDE: 'hide',
        SHOW: 'show',
        ROOTREADY: 'rootready'
    },

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
    _defaults: {
        content: ''
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
            ens: '.ns' + fly.count++,
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
        component.prototype = this;

        if (extra && '_defaults' in extra) {
            extra.defaults =
                $.extend({}, this._defaults, extra._defaults);
        }

        return $.extend(new component(), extra);

        function component() {}
    },

    /**
     * Lazy fly's getter
     * @return jQuery
     */
    root: function() {

        if (!this.$root) {
            var opt = this.options;

            this.$root = $('<div/>')
                .addClass(opt.baseClass)
                .addClass(opt.extraClass)
                .addClass(opt.hideClass)
                .appendTo('body');

            this.trigger(this.EVENTS.ROOTREADY);
        }

        return this.$root;
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
    _action: function() {},

    _content: function(done) {
        var content = this.options.content;

        if (typeof content === 'function') {
            if (content.length) {
                content.call(this, done);
            } else {
                done( content.call(this) || '' );
            }
        } else {
            done( content );
        }
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
     * @param {HTMLElement|String} content
     */
    show: function(content) {

        if (!content) {
            return this._content( $.proxy(this.show, this) );
        }

        var opt = this.options;

        this.trigger(this.EVENTS.SHOW);

        this.root()
            .html( content )
            .addClass( this.options.baseClass + '_' + pos)
            .css( this._position() );

        this.root().removeClass(opt.hideClass);
    },

    /**
     * Hides fly
     */
    hide: function() {
        this.trigger(this.EVENTS.HIDE);

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
        return this.root().hasClass( this.options.hideClass);
    }
};


/**
* Adds jquery events support
*/
$.each(['on', 'off', 'one', 'trigger'], function(i, type) {
    fly._base[type] = function() {
        this._emmiter[type].apply(this._emmiter, arguments);
    }
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
    var pos = this.options.position;
    var arr = this.options.arrowSize;


    var h = this._rect( this.$handle );
    var d = this._rect( this.root() );
    var s = {top: $w.scrollTop(), left: $w.scrollLeft()};

    switch (pos) {
        case 'left':
            css.top = s.top + h.top + (h.height - d.height)/2;
            css.left = s.left + h.left - d.width - arr;
            break;
        case 'right':
            css.top = s.top + h.top + (h.height - d.height)/2;
            css.left = s.left + h.left + h.width + arr;
            break;
        case 'top':
            css.top = s.top + h.top - d.height - arr;
            css.left = s.left + h.left + (h.width - d.width)/2;
            break;
        default /*bottom*/:
            css.top = s.top + h.top + h.height + arr;
            css.left = s.left + h.left + (h.width - d.width)/2;
    }

    return css;
};


/**
 * Dropdown
 *
 * @requires fly._base
 * @requires mixin.position
 *
 * @extends fly._base
 */
fly.dropdown = fly._base.extend({

    /**
     * Toggles dropdown on handle click
     * Hides dropdown on click out of one and ESC
     * @private
     */
    _action: function(mode) {
        var that = this;
        var $root = this.root();
        var $handle = this.$handle;

        if (mode) {
            $handle.on('click' + this.ens, bind);
        } else {
            $handle.off('click' + this.ens);
        }

        function bind() {
            if ( !$root.hasClass(that.options.hideClass) ) {
                return that.hide();
            }

            that.one(that.EVENTS.HIDE, function() {
                $(document).off( 'click' + that.ens + ' keydown' + that.ens );
            });

            $(document)
                .on('click' + that.ens, function(evt) {
                    var target = evt.target;
                    if ( out($root, target) && out($handle, target) ) {
                        that.hide();
                    }
                })
                .on('keydown' + that.ens, function(evt) {
                    if (evt.which === 27) { that.hide(); }
                });

            that.show();
        }


        function out($root, el) {
            return $root[0] !== el && !$.contains($root[0], el);
        }
    },

    defaults: {

        baseClass: 'fly-dropdown',
        hideClass: 'fly-dropdown_hidden',
        extraClass: '',

        position: 'bottom',
        arrowSize: 10
    },

    _rect: fly._mixin.rect,
    _position: fly._mixin.position,
});



/**
 * jQuery extension for dropdown
 *
 * @requires dropdown.js
 */

var expando = 'fly_dropdown_' + (+new Date());

$.fn.dropdown = function dropdown (options) {

    var olddd = this.data(expando);

    switch (options) {

        case 'instance': return olddd;
        case 'destroy': destroy(olddd); break;
        default:
            destroy(olddd);
            this.data(expando, fly.dropdown.create(this, options));
    }

    return this;

    function destroy(dropdown) {
        if (dropdown) {
            dropdown.$handle.removeData(expando);
            dropdown._destroy();
        }
    }
};
})();