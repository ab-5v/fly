
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
        if (mode) {
            this.$handle.on('click' + this.ens, $.proxy(this._bindAction, this));
        } else {
            this.$handle.off('click' + this.ens);
        }
    },

    /**
     * Bind action helper
     * @private
     */
    _bindAction: function() {
        var that = this;
        var $root = this.root();
        var $handle = this.$handle;

        if ( !this.hidden() ) {
            return this.hide();
        }

        this.one(that.EVENTS.HIDE, function() {
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

        position: 'bottom',
        arrowSize: 10
    },

    _rect: fly._mixin.rect,
    _position: fly._mixin.position,
});

