
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
     * @private
     * @param {boolean} mode
     */
    _autohide: function(mode) {
        var that = this;
        var events = 'click' + that.ens + ' keydown' + that.ens + ' touchstart' + that.ens;

        if (!mode) { return; }

        this
            .bind(this.events.show, function() { setTimeout(onshow, 0); })
            .bind(this.events.hide, function() { $(document).unbind(events); });

        function onshow() {
            $(document).bind(events, function(evt) {
                var el = evt.target, root = that.root()[0], handle = that.handle()[0];
                if (
                    evt.type === 'keydown' && evt.which === 27 ||
                    (evt.type === 'click' || evt.type === 'touchstart' ) &&
                        el !== root && !$.contains(root, el) &&
                        el !== handle && !$.contains(handle, el)
                ) {
                    that.hide();
                }
            });
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

