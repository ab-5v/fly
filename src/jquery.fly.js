
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

        var retVal;

        this.each(function(i) {
            if (retVal) { return false; }

            var $el = $(this);
            var old = $el.data(expando);

            switch (options) {

                case 'instance': retVal = old; break;
                case 'destroy': destroy(old); break;
                default:
                    destroy(old);
                    $el.data(expando, component.create($el, options));
            }
        });

        return retVal || this;

        function destroy(component) {
            if (component) {
                component.handle().removeData(expando);
                component._destroy();
            }
        }
    };
};

$.each(fly, fly.register$);
