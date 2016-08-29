

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

    _cuid: fly._count++,

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
     * Open/close trigger
     * @type jQuery
     * @private
     */
    _$handle: null,

    /**
     * Event emmiter
     * @type jQuery
     */
    _emitter: null,

    /**
     * Default class options
     * @param Object
     * @private
     * @static
     */
    defaults: {
        content: '',
        position: 'bottom center',
        baseClass: 'fly-popover',
        hideClass: 'fly-popover--hidden',
        extraClass: '',
        redrawOnShow: true,
        arrowOffset: 15,
        arrowSize: 10
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
     * @return fly
     */
    create: function(handle, options) {

        var inst = this.extend({
            ens: '.ns' + fly._count++,
            _$handle: $(handle),
            _emitter: $({})
        });

        inst.options = $.extend({}, inst.defaults, options);

        fly._instances.push(inst);

        return inst._init();
    },

    /**
     * Extends fly's class and returns new one
     * @param {Object} extra
     * @return fly
     */
    extend: function(extra) {
        this._ctor.prototype = this;

        if (extra && 'defaults' in extra) {
            extra.defaults =
                $.extend({}, this.defaults, extra.defaults);
        }

        var component = $.extend(new this._ctor(), extra);

        component._cuid = fly._count++;

        if (extra.register$) {
            fly.register$(extra.register$, component);
        }

        return component;
    },

    /**
     * Adds listeners for component's action list
     * @param {string} selector
     * @param {Object} options
     */
    delegate: function(selector, options) {
        var that = this;
        var expando = 'fly_delegated_' + that._cuid;

        $.each(that.actions, function(action) {
            $(document.body).delegate(selector, action, function() {
                if ($(this).data(expando)) { return; }

                var inst = that.create(this, options);
                inst.handle().data(expando, 1);
                inst._actionHandler(inst.actions[action]).apply(inst, arguments);
            });
        });
    },

    /**
     * Rootrady callback
     * @virtual
     */
    onrootready: function() {},

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
     * Handle getter
     * @return jQuery
     */
    handle: function() {
        return this._$handle;
    },

    /**
     * Initializes fly
     * @private
     * @return fly
     */
    _init: function() {
        this._action(true);
        this.bind(this.events.rootready, $.proxy(this.onrootready, this));
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

        for (var i = 0, ln = fly._instances.length; i < ln; i++) {
            if (fly._instances[i] === this) {
                fly._instances.splice(i, 1);
                break;
            }
        }
    },

    /**
     * Binds action to handle
     * @private
     * @param {Boolean} mode
     */
    _action: function(mode, actions, handle) {
        handle = handle || this.handle();
        actions = actions || this.actions;

        for (var type in actions) {

            if (mode) {
                handle.bind(type + this.ens, this._actionHandler( actions[type] ));
            } else {
                handle.unbind(type + this.ens);
            }

        }
    },

    _actionHandler: function(action) {
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

        return [base + '_body_' + mod[0], base + '_arrow_' + mod[1]].join(' ');
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
     * Force content rendering
     * @param {function} done
     */
    redraw: function(done) {
        var that = this;

        this._content(function(content) {
            that._render(content);
            if (typeof done === 'function') {
                done(content);
            }
        });
    },

    /**
     * Toggles visibility of the fly
     * @param {Boolean} mode
     */
    toggle: function(mode) {
        mode = arguments.length ? mode : this.hidden();
        this[mode ? 'show' : 'hide']();
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
        this._emitter[type].apply(this._emitter, arguments);
        return this;
    };
});

