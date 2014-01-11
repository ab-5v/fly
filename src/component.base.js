

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

