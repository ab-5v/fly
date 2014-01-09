;(function() {


var wrapper = {
    count: 0,
    actions: {

        click: function(mode) {
            var ns = '.ns' + this.ns;
            var handler = $.proxy(this.toggle, this);

            if (mode) {
                this.$handle.on('click' + ns, handler);
            } else {
                this.$handle.off('click' + ns);
            }
        }

    }
};

wrapper.instance = {

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

        return this.extend({
            ns: 'ns' + wrapper.count++,
            $root: null,
            $handle: $(handle),
            options: $.extend({}, this.defaults, options)
        }).init();

    },

    extend: function(extra) {
        dropdown.prototype = this;

        return $.extend(new dropdown(), extra);

        function dropdown() {}
    },

    init: function() {
        this.handle();

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
        }

        return this.$root;
    },

    destroy: function() {
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
        return $el[0].getBoundingClientRect();
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

    show: function() {
        var opt = this.options;

        this.root()
            .html( this.options.content() )
            .addClass( opt.baseClass + '_' + opt.position );

        this.position();

        this.root().removeClass(this.options.hideClass);
    },

    hide: function() {
        this.root()
            .addClass(this.options.hideClass);
    }

};

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
