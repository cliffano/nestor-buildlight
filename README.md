<img align="right" src="https://raw.github.com/cliffano/nestor-buildlight/master/avatar.jpg" alt="Avatar"/>

[![Build Status](https://secure.travis-ci.org/cliffano/nestor-buildlight.png?branch=master)](http://travis-ci.org/cliffano/nestor-buildlight)
[![Dependencies Status](https://david-dm.org/cliffano/nestor-buildlight.png)](http://david-dm.org/cliffano/nestor-buildlight)
[![Coverage Status](https://coveralls.io/repos/cliffano/nestor-buildlight/badge.png?branch=master)](https://coveralls.io/r/cliffano/nestor-buildlight?branch=master)
[![Published Version](https://badge.fury.io/js/nestor-buildlight.png)](http://badge.fury.io/js/nestor-buildlight)
<br/>
[![npm Badge](https://nodei.co/npm/nestor-buildlight.png)](http://npmjs.org/package/nestor-buildlight)

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

[Developer's Guide](http://cliffano.github.io/developers_guide.html#nodejs)

Build reports:

* [Code complexity report](http://cliffano.github.io/nestor-buildlight/bob/complexity/plato/index.html)
* [Unit tests report](http://cliffano.github.io/nestor-buildlight/bob/test/buster.out)
* [Test coverage report](http://cliffano.github.io/nestor-buildlight/bob/coverage/buster-istanbul/lcov-report/lib/index.html)
* [Integration tests report](http://cliffano.github.io/nestor-buildlight/bob/test-integration/cmdt.out)
* [API Documentation](http://cliffano.github.io/nestor-buildlight/bob/doc/dox-foundation/index.html)

Related Projects:

* [nestor](http://github.com/cliffano/nestor) - Jenkins CLI and node.js client
* [nestor-ninjablocks](http://github.com/cliffano/nestor-ninjablocks) - CLI for Jenkins Ninja Blocks notifier