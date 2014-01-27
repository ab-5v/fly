
/**
 * Dropdown
 *
 * @requires fly._base
 * @requires mixin.position
 *
 * @extends fly._base
 */
fly.tooltip = fly._base.extend({

    /**
     * Toggle tooltip on hover
     * @private
     */
    _action: function(mode) {
        var that = this;
        var timeout;
        var $handle = this.$handle;

        if (mode) {
            this.$handle
                .on('mouseenter' + this.ens, function() {
                    timeout = setTimeout(function() {
                        that.show();
                    }, 300);
                })
                .on('mouseleave' + this.ens, function() {
                    if (timeout) {
                        clearTimeout(timeout);
                    }
                    that.hide();
                });
        } else {
            this.$handle
                .off('mouseinter' + this.ens)
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

        position: 'bottom center',
        arrowSize: 10
    },

    _rect: fly._mixin.rect,
    _position: fly._mixin.position
});
