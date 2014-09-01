
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
