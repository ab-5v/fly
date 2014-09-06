
/**
 * jQuery extension for dropdown
 *
 * @requires _base.js
 */

$.fly = fly;

/**
 * Registers fly component, as jquery plugin
 * @static
 * @param {String} name
 * @param {Fly} component
 */
fly.register$ = function(type, component) {
    if ( component === fly._base || !(component instanceof fly._base._ctor) ) {
        return;
    }

    var expando = 'fly_' + type + '_' + (+new Date());

    $.fn[ type ] = function(options) {

        return this.each(function(i, $this) {
            var $el = $(this);
            var old = $el.data(expando);

            switch (options) {

                case 'instance': return old;
                case 'destroy': destroy(old); break;
                default:
                    destroy(old);
                    $el.data(expando, component.create($el, options));
            }
        });

        function destroy(component) {
            if (component) {
                component.handle().removeData(expando);
                component._destroy();
            }
        }
    };
};

$.each(fly, fly.register$);
