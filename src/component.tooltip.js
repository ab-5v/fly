
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
        'mouseenter': 'onmouseenter',
        'mouseleave': 'onmouseleave'
    },

    /**
     * Show delay timeout reference
     * @private
     */
    _showTimeout: null,

    /**
     * Hide delay timeout reference
     * @private
     */
    _hideTimeout: null,

    /**
     * Default mouseenter action for tooltip
     */
    onmouseenter: function() {
        var that = this;

        if (this._hideTimeout) {
            clearTimeout(this._hideTimeout);
            this._hideTimeout = null;
        }

        this._showTimeout = setTimeout(function() {
            that.show();
        }, this.options.showDelay);
    },

    /**
     * Default mouseleave action for tooltip
     */
    onmouseleave: function() {
        var that = this;

        if (this._showTimeout) {
            clearTimeout(this._showTimeout);
            this._showTimeout = null;
        }

        this._hideTimeout = setTimeout(function() {
            that.hide();
        }, this.options.hideDelay);
    },

    _action: function(mode) {
        fly._base._action.apply(this, arguments);

        if (this.options.keepOnContent) {
            this._keepOnContent(mode);
        }

    },

    _keepOnContent: function(mode) {
        var that = this;
        var rrevent = this.events.rootready + '._keepOnContent';

        if (mode) {
            this.bind(rrevent, function() {
                fly._base._action.call(that, mode, that.actions, that.root());
            });
        } else {
            this.unbind(rrevent);
            fly._base._action.call(this, mode, this.actions, this.root());
        }
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
        showDelay: 300,
        hideDelay: 300
    },

    _rect: fly._mixin.rect,
    _position: fly._mixin.position
});
