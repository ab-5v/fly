;(function() {

var defaults = {
    baseClass: 'dropdown',
    hideClass: 'dropdown_hidden'
    extraClass: '',
    initialHide: true
};

function dropdown(handle, options) {
    return dropdown.create(handle, options);
};

$.extend(dropdown, {

    create: function(handle, options) {

        ctor.prototype = dropdown;
        return $.extend(new ctor(), {
            $root: null,
            $handle: $(handle),
            options: $.extend({}, defaults, options)
        });

        function ctor() {}
    },

    root: function() {

        if (!this.$root) {
            var opt = this.options;

            this.$root = $('<div/>')
                .addClass(opt.baseClass)
                .addClass(opt.extraClass)
                .addClass(opt.initalHide ? opt.hideClass : '')
                .appendTo('body');
        }

        return this.$root;
    },

    destroy: function() {
        this.$root.remove();
        this.$root = null;
    }

});

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
