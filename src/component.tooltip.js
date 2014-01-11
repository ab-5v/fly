
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
     * Toggle tooltip on hover
     * @private
     */
    _action: function(mode) {
        var that = this;
        var $handle = this.$handle;

        if (mode) {
            this.$handle
                .on('mouseenter' + this.ens, function() { that.show(); })
                .on('mouseleave' + this.ens, function() { that.hide(); });
        } else {
            this.$handle
                .off('mouseinter' + this.ens);
                .off('mouseleave' + this.ens);
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

        position: 'bottom',
        arrowSize: 10
    },

    _rect: fly._mixin.rect,
    _position: fly._mixin.position,
});
