<img align="right" src="https://raw.github.com/cliffano/nestor-buildlight/master/avatar.jpg" alt="Avatar"/>

[![Build Status](https://github.com/cliffano/nestor-buildlight/workflows/CI/badge.svg)](https://github.com/cliffano/nestor-buildlight/actions?query=workflow%3ACI)
[![Security Status](https://snyk.io/test/github/cliffano/nestor-buildlight/badge.svg)](https://snyk.io/test/github/cliffano/nestor-buildlight)
[![Dependencies Status](https://img.shields.io/david/cliffano/nestor-buildlight.svg)](http://david-dm.org/cliffano/nestor-buildlight)
[![Coverage Status](https://img.shields.io/coveralls/cliffano/nestor-buildlight.svg)](https://coveralls.io/r/cliffano/nestor-buildlight?branch=master)
[![Published Version](https://img.shields.io/npm/v/nestor-buildlight.svg)](http://www.npmjs.com/package/nestor-buildlight)
<br/>

Nestor Build Light
------------------

Nestor Build Light is a CLI for Jenkins build light notifier.

This is handy for monitoring Jenkins build status on a [Delcom USB Visual Indicator](http://www.delcomproducts.com/products_USBLMP.asp) device.

Installation
------------

    npm install -g nestor-buildlight

Usage
-----

Monitor build status and notify build light device:

    nestor-buildlight run

Monitor build status of a job:

    nestor-buildlight run --job <job>

Monitor build status of a view with custom usbled path:

    nestor-buildlight run --view <view> --usbled /sys/bus/usb/drivers/usbled/2-1.5:1.0

For build light with non-RGB colour scheme, specify custom colour scheme:

    nestor-buildlight run --scheme red,green,yellow

To customise status-colour map:

    nestor-buildlight run --scheme red,blue,yellow --map FAIL=yellow,OK=blue,WARN=red

If your team keeps ignoring failure notifications, you can blink the build light on failure (WARNING: this will annoy your team, and someone will either go berserk or fix the build a.s.a.p):

    nestor-buildlight run --blink-on-failure

Configuration
-------------

Set Jenkins URL in JENKINS_URL environment variable (defaults to http://localhost:8080):

(*nix)

    export JENKINS_URL=http://user:pass@host:port/path

(Windows)

    set JENKINS_URL=http://user:pass@host:port/path

As an alternative to password, you can use Jenkins API token instead. Jenkins API token can be found on Jenkins user configuration page.

Colophon
--------

[Developer's Guide](https://cliffano.github.io/developers_guide.html#nodejs)

Build reports:

* [Code complexity report](https://cliffano.github.io/nestor-buildlight/complexity/plato/index.html)
* [Unit tests report](https://cliffano.github.io/nestor-buildlight/test/mocha.txt)
* [Test coverage report](https://cliffano.github.io/nestor-buildlight/coverage/c8/index.html)
* [Integration tests report](https://cliffano.github.io/nestor-buildlight/test-integration/cmdt.txt)
* [API Documentation](https://cliffano.github.io/nestor-buildlight/doc/jsdoc/index.html)

Related Projects:

* [nestor](http://github.com/cliffano/nestor) - Jenkins CLI and node.js client
* [nestor-lifx](http://github.com/cliffano/nestor-lifx) - CLI for Jenkins LIFX notifier
* [nestor-ninjablocks](http://github.com/cliffano/nestor-ninjablocks) - CLI for Jenkins Ninja Blocks notifier
