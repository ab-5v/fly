;(function() {

function dropdown(handle, options) {
    return dropdown.fn.create(handle, options);
};

dropdown.count = 0;
dropdown.defaults = {

    baseClass: 'dropdown',
    hideClass: 'dropdown_hidden',
    extraClass: '',
    initialHide: true,

    uniqGroup: 'uniq',
    action: 'click',
    content: function() {
        return '<div>Conten</div>';
    }
};

dropdown.fn = {

    create: function(handle, options) {

        dropdown_.prototype = dropdown.fn;
        return $.extend(new dropdown_(), {
            ns: 'ns' + dropdown.count++,
            $root: null,
            $handle: $(handle),
            options: $.extend({}, dropdown.defaults, options)
        }).init();

        function dropdown_() {}
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
    },

    handle: function() {
        var ns = '.' + this.ns;
        var action = this.options.action;

        if (action === 'click') {
            this.$handle
                .on('click' + ns, $.proxy(this.toggle, this));

        } else if (action === 'hover') {
            this.$handle
                .on('mouseenter' + ns, $.proxy(this.show, this))
                .on('mouseleave' + ns, $.proxy(this.hide, this))

        } else if (typeof action === 'function') {
            action()
        }
    },

    position: function() {
        var handle = this.$handle[0].getBoundingClientRect();
        var dropdown = this.root()[0].getBoundingClientRect();
        var scroll = {top: $(window).scrollTop(), left: $(window).scrollLeft()};

        this.root().css({
            top: scroll.top + handle.top + handle.height + 10,
            left: scroll.left + handle.left + (handle.width - dropdown.width)/2
        });
    },

    toggle: function() {
        this[this.root().hasClass(this.options.hideClass) ? 'show' : 'hide']();
    },

    show: function() {
        this.root().html( this.options.content() );
        this.position();
        this.root().removeClass(this.options.hideClass);
    },

    hide: function() {
        this.root()
            .addClass(this.options.hideClass);
    }

};

var expando = 'dropdown_' + +new Date();

$.fn.dropdown = function fn_dropdown (options) {

    var olddd = this.data(expando);

    switch (options) {

        case 'dropdown': return olddd;
        case 'destroy': destroy(olddd); break;
        default:
            destroy(olddd);
            this.data(expando, dropdown(this, options));
    }

    return this;

    function destroy(dropdown) {
        if (dropdown) {
            dropdown.$handle.removeData(expando);
            dropdown.destroy();
        }
    }
};

})();
