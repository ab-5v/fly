

hndl._base = {

    /**
     * Avaliable events
     * @enum
     */
    EVENTS: {
    },

    /**
     * DOM root
     * @type jQuery
     * @private
     */
    _$root: null,

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
    _defaults: null,

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
     * Creates instance of hndl
     * @param {jQuery} handle
     * @param {Object} options
     * @static
     * @return hndl
     */
    create: function(handle, options) {

        var inst = this.extend({
            ens: '.ns' + hndl.count++,
            $root: null,
            $handle: $(handle)
        });

        inst.options = $.extend({}, inst.defaults, options);
        return inst._init();
    },

    /**
     * Extends hndl's class and returns new one
     * @param {Object} extra
     * @static
     * @return hndl
     */
    extend: function(extra) {
        hndl.prototype = this;

        if (extra && '_defaults' in extra) {
            extra.defaults =
                $.extend({}, this._defaults, extra._defaults);
        }

        return $.extend(new dropdown(), extra);

        function hndl() {}
    },

    /**
     * Initializes hndl
     * @private
     * @return hndl
     */
    _init: function() {
        this._action();
        this.init();
        return this;
    },

    /**
     * Cleans up hndl
     */
    _destroy: function() {
        this.destroy();

        if (this._$root) {
            this._$root.remove();
            this._$root = null;
        }
        this.action.call(this, false);
    },

    /**
     * Public init, should be overwritten
     * @abstract
     */
    init: function() {
    },

    /**
     * Public destroy, Should be overwritten
     * @abstract
     */
    destroy: function() {
    },

    /**
     * Binds action to $handle
     * @abstract
     * @private
     */
    _action: function() {
    },

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
     * Shows hndl
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
            .addClass( opt.baseClass + '_' + opt.position );

        this.position();

        this.root().removeClass(opt.hideClass);
    },

    /**
     * Hides hndl
     */
    hide: function() {
        this.trigger(this.EVENTS.HIDE);

        this.root()
            .addClass(this.options.hideClass);
    },

    /**
     * Toggles visibility of the hndl
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
}
