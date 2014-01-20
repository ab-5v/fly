FLY
===============
Popover/dropdown/tooltip/popup/whateveryouwant library.<br/>
Requires jQuery 1.7+. Works for modern browsers and IE8+.<br/>
Contains [_base](#base) component you can extend and ready to use [dropdown](#dropdown) and [tooltip](#tooltip) components.

## Base
Is an abstract class you can extend to build your own popover type. You can find it at `fly._base`

- [extend(extra)](#extendextra)
- [create(options)](#createoptions)
- [defaults](#defaults)
- [options.content](#optionscontent)
- [show(content)](#showcontent)
- [hide()](#hidetrigger)
- [trigger()](#hidetrigger)
- [hidden()](#hidden)
- [root()](#root)
- [init()](#init)
- [destroy()](#destroy)
- [on()](#onoffonetrigger)
- [off()](#onoffonetrigger)
- [one()](#onoffonetrigger)
- [trigger()](#onoffonetrigger)
- [EVENTS](#events)

### extend(extra)
Creates new class, based on context's class:
```
var popoverus = fly._base.extend({content: function() {return 'popoverus';}});
```

### create(options)
Creates an instance of class with a given options:
```
var popoverA = popoverus.create({forceReload: true});
```

### defaults
Objects with defaults options:
```
{
  baseClass: '...', // class to be added to created root
  hideClass: '...', // class to be added on .hide() and removed on .show()
  extraClass: '...', // any additional classes
  
  content: '' // defines how to get content for the popover
}
```

### options.content
Defines rules to get popover's content, can be:
- `string`, so `root` will be filled with this string
- `function() { return '...'; }` sync function, `root` will be filled with the returned value
- `function(done) { ... done(result); }` async function, `root` will be filled with the `result` of `done`, when it will be ready.
For `_base` component `content` calculates on every `show()`

### show(content)
Shows popover and triggers appropriate events. If `content` passed it will be shown, otherwise `options.content` will be called to calculate content.

### hide()/trigger()
Hides/triggers popover

### hidden()
Returns `true` if popover is visible and `false` otherwise

### root()
Lazy `root` initiation, will return the `root` and ensure it was created and appropriate evens triggered. By default it creates root on first `show()`

### $handle
jQuery object, representing `handle` which should trigger popover's show/hide actions.

### ens
Event namespace, unique for every instance, use it to add global events and easily detach them.

### init()
Will be called during instance creation, you can bind your events or whatever you want

### destroy()
Will be called during popover destroying, you can clean it up if you added something special

### on/off/one/trigger
Just a jQuery eventing method attached to each instance, so each instance can be an event emitter.

### Events:
- `SHOW` on popover show 
- `HIDE` on popover hide
- `ROOTREADY` on root element created (first `root()` call)

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

    position: 'bottom', // where to open
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

  position: 'bottom', // where to open
  arrowSize: 10       // offset between tooltip and handle
}
```
Adds `handle`'s `action`, which show tooltip on `handle`'s mouseenter with 300ms delay and hides it on mouseleave
