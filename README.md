<img align="right" src="https://raw.github.com/cliffano/nestor-buildlight/master/avatar.jpg" alt="Avatar"/>

[![Build Status](https://secure.travis-ci.org/cliffano/nestor-buildlight.png?branch=master)](http://travis-ci.org/cliffano/nestor-buildlight)
[![Dependencies Status](https://david-dm.org/cliffano/nestor-buildlight.png)](http://david-dm.org/cliffano/nestor-buildlight)
[![Coverage Status](https://coveralls.io/repos/cliffano/nestor-buildlight/badge.png?branch=master)](https://coveralls.io/r/cliffano/nestor-buildlight?branch=master)
[![Published Version](https://badge.fury.io/js/nestor-buildlight.png)](http://badge.fury.io/js/nestor-buildlight)
<br/>
[![npm Badge](https://nodei.co/npm/nestor-buildlight.png)](http://npmjs.org/package/nestor-buildlight)

Nestor Build Light
------------------

Nestor Build Light is CLI for Jenkins build light notifier.

This is handy for monitoring Jenkins build status on a Delcom USB Visual Indicator device.

Installation
------------

    npm install -g nestor-buildlight

Usage
-----

Monitor build status and notify build light device:

    nestor buildlight
    
Monitor build status on a build light with custom view and usbled path:

    nestor buildlight --view <view> --usbled /sys/bus/usb/drivers/usbled/2-1.5:1.0

Configuration
-------------

Set Jenkins URL in JENKINS_URL environment variable (defaults to http://localhost:8080):

(*nix)

    export JENKINS_URL=http://user:pass@host:port/path

(Windows)

    set JENKINS_URL=http://user:pass@host:port/path

As an alternative to password, you can use Jenkins API token instead. Jenkins API token can be found on Jenkins user configuration page.