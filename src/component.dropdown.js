
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
        var $handle = this.$handle;

        if (mode) {
            $handle.on('click' + this.ens, bind);
        } else {
            $handle.off('click' + this.ens);
        }

        function bind() {
            var $root = that.root();

            if ( !that.hidden() ) {
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

