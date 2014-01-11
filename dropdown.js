;(function() {


var wrapper = {
    count: 0,
    actions: {

        click: function(mode) {
            var that = this;
            var $root = this.root();
            var $handle = this.$handle;

            $handle[mode ? 'on' : 'off']('click' + this.ens, bind);

            function bind() {
                if ( !$root.hasClass(that.options.hideClass) ) {
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
        }

    }
};

wrapper.instance = {


    EVENTS: {
        HIDE: 'hide',
        SHOW: 'show',
        ROOTREADY: ''
    },

    defaults: {

        baseClass: 'dropdown',
        hideClass: 'dropdown_hidden',
        extraClass: '',
        initialHide: true,

        position: 'bottom',
        arrowSize: 10,

        uniqGroup: 'uniq',
        action: 'click',
        content: function() {
            return '<div>Conten</div>';
        }
    },

    create: function(handle, options) {

        var inst = this.extend({
            ens: '.ns' + wrapper.count++,
            $root: null,
            $handle: $(handle)
        });

        inst.options = $.extend({}, inst.defaults, options);
        return inst.init();
    },

    extend: function(extra) {
        dropdown.prototype = this;

        if (extra && 'defaults' in extra) {
            extra.defaults =
                $.extend({}, this.defaults, extra.defaults);
        }

        return $.extend(new dropdown(), extra);

        function dropdown() {}
    },

    initialize: function() {},
    deinitialize: function() {},

    init: function() {
        this.handle();
        this.initialize();

        return this;
    },

    root: function() {

        if (!this.$root) {
            var opt = this.options;

            this.$root = $('<div/>')
                .addClass(opt.baseClass)
                .addClass(opt.extraClass)
                .addClass(opt.hideClass)
                .appendTo('body');

            this.trigger(this.EVENTS.ROOTREADY);
        }

        return this.$root;
    },

    destroy: function() {
        this.deinitialize();
        if (this.$root) {
            this.$root.remove();
            this.$root = null;
        }
        this.action.call(this, false);
    },

    handle: function() {
        var action = this.options.action;

        if (action in wrapper.actions) {
            this.action = wrapper.actions[action];
        } else if (typeof action === 'function') {
            this.action = action;
        } else {
            this.action = $.noop;
        }

        this.action.call(this, true);
    },

    rect: function($el) {
        var rect = $el[0].getBoundingClientRect();

        // IE
        if ( !('width' in rect) ) {
            rect = $.extend({}, rect);
            rect.width = $el.outerWidth();
            rect.height = $el.outerHeight();
        }

        return rect;
    },

    position: function() {
        var css = {};

        var $w = $(window);
        var pos = this.options.position;
        var arr = this.options.arrowSize;

        var h = this.rect( this.$handle );
        var d = this.rect( this.root() );
        var s = {top: $w.scrollTop(), left: $w.scrollLeft()};

        switch (pos) {
            case 'left':
                css.top = s.top + h.top + (h.height - d.height)/2;
                css.left = s.left + h.left - d.width - arr;
                break;
            case 'right':
                css.top = s.top + h.top + (h.height - d.height)/2;
                css.left = s.left + h.left + h.width + arr;
                break;
            case 'top':
                css.top = s.top + h.top - d.height - arr;
                css.left = s.left + h.left + (h.width - d.width)/2;
                break;
            default /*bottom*/:
                css.top = s.top + h.top + h.height + arr;
                css.left = s.left + h.left + (h.width - d.width)/2;
        }

        this.root().css(css);
    },

    toggle: function() {
        this[this.root().hasClass(this.options.hideClass) ? 'show' : 'hide']();
    },

    show: function(content) {
        var that = this;
        var opt = this.options;

        if (!content) {
            if (opt.content.length) {
                opt.content.call(this, function(result) {
                    that.show(result);
                });
                return;
            } else {
                content = opt.content.call(this) || '';
            }
        }

        this.trigger(this.EVENTS.SHOW);
        this.root()
            .html( content )
            .addClass( opt.baseClass + '_' + opt.position );

        this.position();

        this.root().removeClass(opt.hideClass);
    },

    hide: function() {
        this.trigger(this.EVENTS.HIDE);
        this.root()
            .addClass(this.options.hideClass);
    }

};

$.each(['on', 'off', 'one', 'trigger'], function(i, type) {
    wrapper.instance[type] = function() {
        this.root()[type].apply(this.root(), arguments);
    }
});

var expando = 'dropdown_' + (+new Date());

$.fn.dropdown = function dropdown (options) {

    var olddd = this.data(expando);

    switch (options) {

        case 'instance': return olddd;
        case 'destroy': destroy(olddd); break;
        default:
            destroy(olddd);
            this.data(expando, wrapper.instance.create(this, options));
    }

    return this;

    function destroy(dropdown) {
        if (dropdown) {
            dropdown.$handle.removeData(expando);
            dropdown.destroy();
        }
    }
};

$.dropdown = wrapper;

})();
