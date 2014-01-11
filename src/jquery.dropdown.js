
/**
 * jQuery extension for dropdown
 *
 * @requires dropdown.js
 */

$.fly = fly;

$.each(['dropdown', 'tooltip'], function(i, component) {

    var expando = 'fly_' + component + '_' + (+new Date());

    $.fn[ component ] = function fly_$fn (options) {

        var old = this.data(expando);

        switch (options) {

            case 'instance': return old;
            case 'destroy': destroy(old); break;
            default:
                destroy(old);
                this.data(expando, fly[component].create(this, options));
        }

        return this;

        function destroy(component) {
            if (component) {
                component.$handle.removeData(expando);
                component._destroy();
            }
        }
    };
});
