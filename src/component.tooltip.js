
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
     * Delay timeout reference
     * @private
     */
    _timeout: null,

    /**
     * Default mouseenter action for tooltip
     */
    onmouseenter: function() {
        var that = this;
        this._timeout = setTimeout(function() {
            that.show();
        }, this.options.delay);
    },

    /**
     * Default mouseleave action for tooltip
     */
    onmouseleave: function() {
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
