Camelittle
==========

A node wrapper for fswebcam controller providing configurable async static frame
grabbing with [fswebcam](https://github.com/fsphil/fswebcam).

Inspired by the work of [Camelot](https://github.com/pdeschen/camelot) but less
prescriptive.

Setup
-----

Firstly, *you must have `fswebcam` installed in your path*.

* Ubuntu: `apt-get install fswebcam`
* Fedora: `yum install fswebcam`

Usage
-----

For basic usage:

```JavaScript
var fs = require('fs');
var Camelittle = require('camelittle');
var clInstance = new Camelittle({});
clInstance.grab(function(err, image){
	fs.writeFileSync('callback.jpg', val, 'binary');
});
```

Camelittle also supports events:

```JavaScript
var fs = require('fs');
var Camelittle = require('camelittle');
var clInstance = new Camelittle({});

clInstance.on('frame', function (image) {
	fs.writeFileSync('image.jpg', image, 'binary');
});

clInstance.on('error', function (err) {
	console.error(err);
});

clInstance.grab({})
```

### Camelittle.grab([options], [callback])
The grab method takes an optional `options` object as well as an optional
`callback` function.

The following are acceptable parameters depending on how you want to use
the library:

* `clInstance.grab({})`
* `clInstance.grab(function(){})`
* `clInstance.grab({}, function(){}))`

This module will not automatically poll the webcam, so it's up to you to call
`grab` however often you need.


Options
-------

Both the constructor and `grab` methods take the same options as `fswebcam` with
the exception of the `controls` option (see below).

Options are specified as an object, with the `--parameter` as the key (without
the dashes) and the value as the value. Parameters which don't have a value
should be `null`.

An example of configuring some options:

```JavaScript
var clInstance = new Camelittle({
	device: '/dev/video0',
	resolution: '1920x1080',
	frames: 5,
	'no-banner': null
});
```

For a full list of options, run the command `fswebcam -h`.

Webcam controls
---------------

Webcam controls let you specify cam-specific things such as brightness, focus,
power line frequency etc.

These are probably specific to your webcam, so to find out which options are
available and how to set them, run `fswebcam --list-controls` on the command
line.

Once you know which options you'd like to set, configure them like so:

```JavaScript
var clInstance = new Camelittle({
	controls: {
		'Brightness': 0,
		'Contrast': 0,
		'Saturation': 100,
		'Hue': 1000,
	}
});
```

Bugs & Errata
-------------

This is a really quick and dirty lib and you should exercise the appropriate
cautions.

[Bugs and features](https://github.com/AshKyd/camelittle/issues) can be reported
on GitHub.