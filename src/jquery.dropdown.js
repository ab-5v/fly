
/**
 * jQuery extension for dropdown
 *
 * @requires dropdown.js
 */

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
            dropdown._destroy();
        }
    }
};
