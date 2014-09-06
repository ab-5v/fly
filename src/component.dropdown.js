
/**
 * Dropdown
 *
 * @requires fly._base
 * @requires mixin.position
 *
 * @extends fly._base
 */
fly.dropdown = fly._base.extend({

    actions: {
        'click': '_actionClick'
    },

    /**
     * Bind action helper
     * @private
     */
    _actionClick: function() {
        var that = this;
        var $handle = this.$handle;

        if ( !this.hidden() ) {
            return this.hide();
        }

        this.one(that.events.hide, function() {
            $(document).unbind( 'click' + that.ens + ' keydown' + that.ens );
        });

        this.one(that.events.show, function() {
            $(document)
                .bind('click' + that.ens, function(evt) {
                    var target = evt.target;
                    if ( out(that.root(), target) && out($handle, target) ) {
                        that.hide();
                    }
                })
                .bind('keydown' + that.ens, function(evt) {
                    if (evt.which === 27) { that.hide(); }
                });
        });

        this.show();

        function out($root, el) {
            return $root[0] !== el && !$.contains($root[0], el);
        }
    },

    _actionResize: function() {
        if ( this.hidden() ) { return; }

        this.root().css( this._position() );
    },

    _action: function(mode) {
        fly._base._action.apply(this, arguments);
        fly._base._action.call(this,
            mode, {'resize': '_actionResize'}, $(window));
    },

    /**
     * Deafult settings for dropdown
     * @type Object
     */
    defaults: {
        baseClass: 'fly-dropdown',
        hideClass: 'fly-dropdown_hidden',
        extraClass: '',

        position: 'bottom center',
        arrowSize: 10
    },

    _rect: fly._mixin.rect,
    _position: fly._mixin.position
});

