
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
    var arr = this.options.arrowSize;

    var popover = pos.shift();
    var arrow = pos.shift();

    var a = {};
    var d = this._rect( this.root() );
    var h = this._rect( this.handle() );
    var f = this.root().css('position') === 'fixed';
    var s = f ? {top: 0, left: 0} : {top: $w.scrollTop(), left: $w.scrollLeft()};

    switch (arrow) {
        case 'top':     a.top = h.height / 2 - arr * 1.5; break;
        case 'left':    a.left = h.width / 2 - arr * 1.5; break;
        case 'right':   a.left = h.width / 2 - d.width + arr * 1.5; break;
        case 'bottom':  a.top = h.height / 2 - d.height + arr * 1.5; break;
        default /*center*/:
            a.top = (h.height - d.height) / 2;
            a.left = (h.width - d.width) / 2;
            break;
    }

    switch (popover) {
        case 'left':
            css.top = s.top + h.top + a.top;
            css.left = s.left + h.left - d.width - arr;
            break;
        case 'right':
            css.top = s.top + h.top + a.top;
            css.left = s.left + h.left + h.width + arr;
            break;
        case 'top':
            css.top = s.top + h.top - d.height - arr;
            css.left = s.left + h.left + a.left;
            break;
        default /*bottom*/:
            css.top = s.top + h.top + h.height + arr;
            css.left = s.left + h.left + a.left;
    }

    return css;
};
