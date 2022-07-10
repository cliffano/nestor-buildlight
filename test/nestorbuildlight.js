"use strict"
/* eslint no-unused-vars: 0 */
import _cli from 'bagofcli';
import fs from 'fs';
import BuildLight from 'buildlight';
import NestorBuildLight from '../lib/nestorbuildlight.js';
import referee from '@sinonjs/referee';
import sinon from 'sinon';
import { doesNotMatch } from 'assert';
const assert = referee.assert;

describe('nestorbuildlight - nestorbuildlight', function () {
  beforeEach(function () {
    this.mockCli = sinon.mock(_cli);
    this.buildLightDriverStub = sinon.stub(BuildLight.prototype, '_driver').value(function (opts) {
      return;
    });
  });
  afterEach(function () {
    sinon.verify();
    sinon.restore();
  });
  it('should set opts to default when there is no customisation', function(done) {
    const nestor= new NestorBuildLight({});
    assert.equals(nestor.opts.scheme, ['red', 'green', 'blue']);
    assert.equals(nestor.opts.map, {ok: 'green', fail: 'red', warn: 'blue'});
    assert.isObject(nestor.buildLight);
    done();
  });
  it('should default warn colour map to yellow when blue colour is not part of the scheme', function(done) {
    const nestor= new NestorBuildLight({ scheme: ['red', 'green', 'yellow'] });
    assert.equals(nestor.opts.scheme, ['red', 'green', 'yellow']);
    assert.equals(nestor.opts.map, { ok: 'green', fail: 'red', warn: 'yellow' });
    assert.isObject(nestor.buildLight);
    done();
  });
});

describe('nestorbuildlight - notify', function () {
  beforeEach(function () {
    this.mockConsole = sinon.mock(console);
    this.mockFs = sinon.mock(fs);
    this.buildLightUnblinkStub = sinon.stub(BuildLight.prototype, 'unblink').value(function (cb) {
      cb();
    });
  });
  afterEach(function (done) {
    // allows a 1 second tick in order to allow buildlight to complete
    // note that buildlight doesn't have a callback as part of notification due to the potential continuous action
    setTimeout(function () {
      sinon.verify();
      sinon.restore();
      done();
    }, 1000);
  });
  it('should switch all colours off then switch one colour on on build light device based on notification status', function() {
    this.mockConsole.expects('log').once().withExactArgs('Setting build light colour to %s for status %s', 'green', 'ok');
    this.mockFs.expects('writeFileSync').once().withExactArgs('/some/usbled/path/red', '0');
    this.mockFs.expects('writeFileSync').once().withExactArgs('/some/usbled/path/green', '0');
    this.mockFs.expects('writeFileSync').once().withExactArgs('/some/usbled/path/blue', '0');
    this.mockFs.expects('writeFileSync').once().withExactArgs('/some/usbled/path/green', '1');
    const nestor= new NestorBuildLight({ scheme: ['red', 'green', 'blue'], usbled: '/some/usbled/path/', platform: 'linux' });
    nestor.notify('ok');
  });
  it('should switch all colours off then switch blue colour on on build light device when notification status is warn', function() {
    this.mockConsole.expects('log').once().withExactArgs('Setting build light colour to %s for status %s', 'blue', 'warn');
    this.mockFs.expects('writeFileSync').once().withExactArgs('/some/usbled/path/red', '0');
    this.mockFs.expects('writeFileSync').once().withExactArgs('/some/usbled/path/green', '0');
    this.mockFs.expects('writeFileSync').once().withExactArgs('/some/usbled/path/blue', '0');
    this.mockFs.expects('writeFileSync').once().withExactArgs('/some/usbled/path/blue', '1');
    const nestor= new NestorBuildLight({ scheme: ['red', 'green', 'blue'], usbled: '/some/usbled/path/', platform: 'linux' });
    nestor.notify('warn');
  });
  it('should switch all colours off then switch yellow colour on on build light device when notification status is warn', function() {
    this.mockConsole.expects('log').once().withExactArgs('Setting build light colour to %s for status %s', 'yellow', 'warn');
    this.mockFs.expects('writeFileSync').once().withExactArgs('/some/usbled/path/red', '0');
    this.mockFs.expects('writeFileSync').once().withExactArgs('/some/usbled/path/green', '0');
    this.mockFs.expects('writeFileSync').once().withExactArgs('/some/usbled/path/yellow', '0');
    this.mockFs.expects('writeFileSync').once().withExactArgs('/some/usbled/path/yellow', '1');
    const nestor= new NestorBuildLight({ scheme: ['red', 'green', 'yellow'], usbled: '/some/usbled/path/', platform: 'linux' });
    nestor.notify('warn');
  });
  it('should switch all colours on on build light device when status is unknown', function() {
    this.mockConsole.expects('log').once().withExactArgs('Setting build light colour to %s for status %s', 'on', 'SOMEUNKNOWNSTATUS');
    this.mockFs.expects('writeFileSync').once().withExactArgs('/some/usbled/path/red', '1');
    this.mockFs.expects('writeFileSync').once().withExactArgs('/some/usbled/path/green', '1');
    this.mockFs.expects('writeFileSync').once().withExactArgs('/some/usbled/path/blue', '1');
    const nestor= new NestorBuildLight({ scheme: ['red', 'green', 'blue'], usbled: '/some/usbled/path/', platform: 'linux' });
    nestor.notify('SOMEUNKNOWNSTATUS');
  });
  it('should switch all colours off then switch red colour on on build light device when status is fail', function() {
    this.mockConsole.expects('log').once().withExactArgs('Setting build light colour to %s for status %s', 'red', 'fail');
    this.mockFs.expects('writeFileSync').once().withExactArgs('/some/usbled/path/red', '0');
    this.mockFs.expects('writeFileSync').once().withExactArgs('/some/usbled/path/green', '0');
    this.mockFs.expects('writeFileSync').once().withExactArgs('/some/usbled/path/blue', '0');
    this.mockFs.expects('writeFileSync').once().withExactArgs('/some/usbled/path/red', '1');
    const nestor= new NestorBuildLight({ scheme: ['red', 'green', 'blue'], usbled: '/some/usbled/path/', platform: 'linux' });
    nestor.notify('fail');
  });
  it('should default to rgb scheme and switch all colours on on build light device when status is unknown', function() {
    this.mockConsole.expects('log').once().withExactArgs('Setting build light colour to %s for status %s', 'on', 'SOMEUNKNOWNSTATUS');
    this.mockFs.expects('writeFileSync').once().withExactArgs('/some/usbled/path/red', '1');
    this.mockFs.expects('writeFileSync').once().withExactArgs('/some/usbled/path/green', '1');
    this.mockFs.expects('writeFileSync').once().withExactArgs('/some/usbled/path/blue', '1');
    const nestor= new NestorBuildLight({ usbled: '/some/usbled/path/', platform: 'linux' });
    nestor.notify('SOMEUNKNOWNSTATUS');
  });
});

describe('nestorbuildlight - notify with blink enabled', function () {
  beforeEach(function () {
    this.mockConsole = sinon.mock(console);
  });
  afterEach(function () {
    sinon.verify();
    sinon.restore();
  });
  it('should blink red colour when status is fail and blinkOnFailure is true', function() {
    const self = this;
    this.mockConsole.expects('log').once().withExactArgs('Setting build light colour to %s for status %s', 'red', 'fail');
    sinon.stub(BuildLight.prototype, 'blink').value(function (colour, cb) {
      cb();
    });
    sinon.stub(BuildLight.prototype, 'unblink').value(function (cb) {
      cb();
    });
    const nestor = new NestorBuildLight({ scheme: ['red', 'green', 'blue'], usbled: '/some/usbled/path/', platform: 'linux', blinkOnFailure: true });
    nestor.notify('fail');
  });
  it('should log error message when an error occurs while blinking failure colour', function() {
    const self = this;
    this.mockConsole.expects('log').once().withExactArgs('Setting build light colour to %s for status %s', 'red', 'fail');
    this.mockConsole.expects('error').once().withExactArgs('some error');
    sinon.stub(BuildLight.prototype, 'blink').value(function (colour, cb) {
      cb(new Error('some error'));
    });
    sinon.stub(BuildLight.prototype, 'unblink').value(function (cb) {
      cb();
    });
    const nestor = new NestorBuildLight({ scheme: ['red', 'green', 'blue'], usbled: '/some/usbled/path/', platform: 'linux', blinkOnFailure: true });
    nestor.notify('fail');
  });
});

