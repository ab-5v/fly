FLY
===============
Popover/dropdown/tooltip/popup/whateveryouwant library.<br/>
Requires jQuery 1.4+. Works for modern browsers and IE8+.<br/>
Contains [_base](#base) component you can inherit from, ready to use [dropdown](#dropdown) and [tooltip](#tooltip) components, [mixins](#mixins), [jQuery plugin](#jqueryplugin) and some css styling.<br/>

See [Examples](http://artjock.github.io/fly/).

## Base
Is an abstract class you can extend to build your own popover type. You can find it at `fly._base`

- [extend(extra)](#extendextra)
- [create(options)](#createoptions)
- [delegate(selector, options)](#delegateselectoroptions)
- [fly.register$](#flyregister)
- [defaults](#defaults)
- [options.content](#optionscontent)
- [show(content)](#show)
- [hide()](#hide)
- [toggle(mode)](#togglemode)
- [redraw(done)](#redraw)
- [hidden()](#hidden)
- [root()](#root)
- [handle()](#handle)
- [init()](#init)
- [destroy()](#destroy)
- [events](#events)
- [bind()](#events)
- [unbind()](#events)
- [one()](#events)
- [trigger()](#events)

### extend(extra)
Creates new class, based on context's class:
```js
var titletip = fly.tooltip.extend({
    defaults: {
        content: function() {
            return this.handle().attr('title');
        }
    }
});
```

### create(options)
Creates an instance of class with a given options:
```js
$('.js-titletip').each(function() {
    titletip.create(this, {position: $(this).data('position'));
});
```

### delegate(selector, options)
Delegates class on `selector`, creates instance with `options` on every first event from `actions`
```js
fly.tooltip
    .extend({})
    .delegate('.js-live-tooltip', { content: 'live' })
;
```

### defaults
Objects with defaults options:
```
{
  baseClass: '...',     // class to be added to created root
  hideClass: '...',     // class to be added on .hide() and removed on .show()
  extraClass: '...',    // any additional classes

  content: '',          // defines how to get content for the popover
  redrawOnShow: true,   // recalculate content on every/first show event
  register$: 'titletip' // will register titletip as jQuery plugin
}
```

### options.content
Defines rules to get popover's content, can be:
- `string`, so `root` will be filled with this string
- `function() { return '...'; }` sync function, `root` will be filled with the returned value
- `function(done) { ... done(result); }` async function, `root` will be filled with the `result` of `done`, when it will be ready.

```js
// static string
{
    content: '<h1>Contacts</h1><a href="tel://0000">0000</a>'
}
// sync function
{
    content: function() {
        return this.handle().attr('data-title');
    }
}
// async function
{
    content: function(done) {
        $.get('/api/list', function(html) {
            done(html);
        });
    }
}
```
### show(content)
Shows popover and triggers appropriate events. If `content` passed it will be shown, otherwise `options.content` will be called to calculate content.

### hide()/toggle(mode)
Hides/toggles popover

### hidden()
Returns `true` if popover is visible and `false` otherwise

### root()
Lazy `root` initiation, will return the `root` and ensure it was created and appropriate evens triggered. By default it creates root on first `show()`

### handle()
jQuery object, representing `handle` which should trigger popover's show/hide actions.

### ens
Event namespace, unique for every instance, use it to add global events and easily detach them.

### init()
Will be called during instance creation, you can bind your events or whatever you want

### destroy()
Will be called during popover destroying, you can clean it up if you added something special

### bind/unbind/one/trigger
Just a jQuery eventing method attached to each instance, so each instance can be an event emitter.

### Events:
- `show` on popover show
- `hide` on popover hide
- `rootready` on root element created (first `root()` call)

You can use it as:
```
var popoverus = fly._base.extend({
  init: function() {
    this.on(this.EVENTS.ROOTREADY, function() {
      // bind something on root
    })
  }
});
```

## dropdown
Extends `defaults` with
```
 {
    baseClass: 'fly-dropdown',
    hideClass: 'fly-dropdown_hidden',
    extraClass: '',

    position: 'bottom center', // where to open dropdown and where to show tail
    arrowSize: 10       // offset between dropdown and handle
}
```
Adds `handle`'s `action`, which trigger dropdown on `handle` click and closes on click outside dropdown and `ESC`

## tooltip
Extends `defaults` with
```
{
  baseClass: 'fly-tooltip',
  hideClass: 'fly-tooltip_hidden',
  extraClass: '',

  position: 'bottom center', // where to open tooltip and where to show tail
  arrowSize: 10       // offset between tooltip and handle
}
```
Adds `handle`'s `action`, which show tooltip on `handle`'s mouseenter with 300ms delay and hides it on mouseleave

## Mixins

### rect($el)
Returns offsets and dimensions of the `$el` (top/left/right/bottom/width/height)

### position()
Calculates popover position relative to `handle` according to `options.position`

## jQuery plugin
For every non-base component in `fly.*` (`tooltip`, `dropdown`) creates `$.fn` function, which accepts `options` or command, you can use it as:
```
$('.js-handle').dropdown({content: 'dropdown'});
$('.js-handle').dropdown('instance').hidden();
$('.js-handle').dropdown('destroy');
```

### fly.register$
You can register your fly class as a jQuery plugin:
```js
fly.register$('titletip', titletip);
// then
$('.js-titletip').titletip({position: $(this).data('position');
```

## Global functions

### fly.hideAll
Hides all current instances of fly.