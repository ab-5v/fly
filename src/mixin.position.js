
/**
 * Calculates fly position depending on handle
 *
 * @requires mixin.rect
 * @mixin
 * @type Object
 * @property {Number} top
 * @property {Number} left
 */
fly._mixin.position = function() {
    var css = {};

    var $w = $(window);
    var pos = this.options.position.split(' ');
    var ars = this.options.arrowSize;
    var aro = this.options.arrowOffset;

    var body = pos.shift();
    var arrow = pos.shift();

    var a = {};
    var p = this._rect( this.root() );
    var h = this._rect( this.handle() );
    var f = this.root().css('position') === 'fixed';
    var s = f ? {top: 0, left: 0} : {top: $w.scrollTop(), left: $w.scrollLeft()};

    switch (arrow) {
        case 'top':     a.top = h.height / 2 - aro; break;
        case 'left':    a.left = h.width / 2 - aro; break;
        case 'right':   a.left = h.width / 2 - p.width + aro; break;
        case 'bottom':  a.top = h.height / 2 - p.height + aro; break;
        default /*center*/:
            a.top = (h.height - p.height) / 2;
            a.left = (h.width - p.width) / 2;
            break;
    }

    switch (body) {
        case 'left':
            css.top = s.top + h.top + a.top;
            css.left = s.left + h.left - p.width - ars;
            break;
        case 'right':
            css.top = s.top + h.top + a.top;
            css.left = s.left + h.left + h.width + ars;
            break;
        case 'top':
            css.top = s.top + h.top - p.height - ars;
            css.left = s.left + h.left + a.left;
            break;
        default /*bottom*/:
            css.top = s.top + h.top + h.height + ars;
            css.left = s.left + h.left + a.left;
    }

    return css;
};
