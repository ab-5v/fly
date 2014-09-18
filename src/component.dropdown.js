
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
        'click': 'onclick'
    },

    /**
     * Default click action for dropdown
     */
    onclick: function() {
        this.toggle();
    },

    /**
     * Default window.onresize handler for dropdown
     */
    onresize: function() {
        if ( this.hidden() ) { return; }

        this.root().css( this._position() );
    },

    /**
     * Base _action + window resize handler
     *
     * @private
     * @param {Boolean} mode
     */
    _action: function(mode) {

        fly._base._action.apply(this, arguments);
        fly._base._action.call(this,
            mode, {'resize': 'onresize'}, $(window));

        this._autohide(mode);
    },

    /**
     * Dropdown can be closed by clicking outside or pressing ESC
     *
     * @private
     * @param {boolean} mode
     */
    _autohide: function(mode) {
        var that = this;

        if (!mode) { return; }

        this.bind(this.events.hide, function() {
            $(document).unbind( 'click' + that.ens + ' keydown' + that.ens );
        });

        this.bind(this.events.show, function() {
            setTimeout(function() {
                $(document)
                    .bind('click' + that.ens, function(evt) {
                        var target = evt.target;
                        if ( out(that.root(), target) && out(that.handle(), target) ) {
                            that.hide();
                        }
                    })
                    .bind('keydown' + that.ens, function(evt) {
                        if (evt.which === 27) { that.hide(); }
                    });
            }, 0);
        });

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

        position: 'bottom center',
        arrowSize: 10
    },

    _rect: fly._mixin.rect,
    _position: fly._mixin.position
});

