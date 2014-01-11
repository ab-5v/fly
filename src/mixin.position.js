
/**
 * Calculates hndl position depending on handle
 *
 * @requires mixin.rect
 * @mixin
 * @type Object
 * @property {Number} top
 * @property {Number} left
 */
hndl._mixin.position = function() {
    var css = {};

    var $w = $(window);
    var pos = this.options.position;
    var arr = this.options.arrowSize;


    var h = this._rect( this.$handle );
    var d = this._rect( this.root() );
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

    return css;
};
