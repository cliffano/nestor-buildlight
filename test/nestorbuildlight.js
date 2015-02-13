var BuildLight       = require('buildlight');
var buster           = require('buster-node');
var fs               = require('fs');
var NestorBuildLight = require('../lib/nestorbuildlight');
var referee          = require('referee');
var assert           = referee.assert;

buster.testCase('nestorbuildlight - nestorbuildlight', {
  setUp: function () {
    this.mock({});
    this.stub(BuildLight.prototype, '_driver', function (opts) {
      return;
    });
  },
  'should set opts to default when there is no customisation': function (done) {
    var nestor = new NestorBuildLight({});
    assert.equals(nestor.opts.scheme, ['red', 'green', 'blue']);
    assert.equals(nestor.opts.map, { ok: 'green', fail: 'red', warn: 'blue' });
    assert.defined(nestor.buildLight);
    done();
  },
  'should default warn colour map to yellow when blue colour is not part of the scheme': function (done) {
    var nestor = new NestorBuildLight({ scheme: ['red', 'green', 'yellow'] });
    assert.equals(nestor.opts.scheme, ['red', 'green', 'yellow']);
    assert.equals(nestor.opts.map, { ok: 'green', fail: 'red', warn: 'yellow' });
    assert.defined(nestor.buildLight);
    done();
  }
});

buster.testCase('nestorbuildlight - notify', {
  setUp: function () {
    this.mockConsole = this.mock(console);
    this.mockFs = this.mock(fs);
    this.stub(BuildLight.prototype, 'unblink', function (cb) {
      cb();
    });
  },
  'should switch all colours off then switch one colour on on build light device based on notification status': function () {
    this.mockConsole.expects('log').once().withExactArgs('Setting build light colour to %s for status %s', 'green', 'ok');
    this.mockFs.expects('writeFileSync').once().withExactArgs('/some/usbled/path/red', 0);
    this.mockFs.expects('writeFileSync').once().withExactArgs('/some/usbled/path/green', 0);
    this.mockFs.expects('writeFileSync').once().withExactArgs('/some/usbled/path/blue', 0);
    this.mockFs.expects('writeFileSync').once().withExactArgs('/some/usbled/path/green', 1);
    var nestor = new NestorBuildLight({ scheme: ['red', 'green', 'blue'], usbled: '/some/usbled/path/', platform: 'linux' });
    nestor.notify('ok');
  },
  'should switch all colours off then switch blue colour on on build light device when notification status is warn': function () {
    this.mockConsole.expects('log').once().withExactArgs('Setting build light colour to %s for status %s', 'blue', 'warn');
    this.mockFs.expects('writeFileSync').once().withExactArgs('/some/usbled/path/red', 0);
    this.mockFs.expects('writeFileSync').once().withExactArgs('/some/usbled/path/green', 0);
    this.mockFs.expects('writeFileSync').once().withExactArgs('/some/usbled/path/blue', 0);
    this.mockFs.expects('writeFileSync').once().withExactArgs('/some/usbled/path/blue', 1);
    var nestor = new NestorBuildLight({ scheme: ['red', 'green', 'blue'], usbled: '/some/usbled/path/', platform: 'linux' });
    nestor.notify('warn');
  },
  'should switch all colours off then switch yellow colour on on build light device when notification status is warn': function () {
    this.mockConsole.expects('log').once().withExactArgs('Setting build light colour to %s for status %s', 'yellow', 'warn');
    this.mockFs.expects('writeFileSync').once().withExactArgs('/some/usbled/path/red', 0);
    this.mockFs.expects('writeFileSync').once().withExactArgs('/some/usbled/path/green', 0);
    this.mockFs.expects('writeFileSync').once().withExactArgs('/some/usbled/path/yellow', 0);
    this.mockFs.expects('writeFileSync').once().withExactArgs('/some/usbled/path/yellow', 1);
    var nestor = new NestorBuildLight({ scheme: ['red', 'green', 'yellow'], usbled: '/some/usbled/path/', platform: 'linux' });
    nestor.notify('warn');
  },
  'should switch all colours on on build light device when status is unknown': function () {
    this.mockConsole.expects('log').once().withExactArgs('Setting build light colour to %s for status %s', 'on', 'SOMEUNKNOWNSTATUS');
    this.mockFs.expects('writeFileSync').once().withExactArgs('/some/usbled/path/red', 1);
    this.mockFs.expects('writeFileSync').once().withExactArgs('/some/usbled/path/green', 1);
    this.mockFs.expects('writeFileSync').once().withExactArgs('/some/usbled/path/blue', 1);
    var nestor = new NestorBuildLight({ scheme: ['red', 'green', 'blue'], usbled: '/some/usbled/path/', platform: 'linux' });
    nestor.notify('SOMEUNKNOWNSTATUS');
  },
  'should switch all colours off then switch red colour on on build light device when status is fail': function () {
    this.mockConsole.expects('log').once().withExactArgs('Setting build light colour to %s for status %s', 'red', 'fail');
    this.mockFs.expects('writeFileSync').once().withExactArgs('/some/usbled/path/red', 0);
    this.mockFs.expects('writeFileSync').once().withExactArgs('/some/usbled/path/green', 0);
    this.mockFs.expects('writeFileSync').once().withExactArgs('/some/usbled/path/blue', 0);
    this.mockFs.expects('writeFileSync').once().withExactArgs('/some/usbled/path/red', 1);
    var nestor = new NestorBuildLight({ scheme: ['red', 'green', 'blue'], usbled: '/some/usbled/path/', platform: 'linux' });
    nestor.notify('fail');
  },
  'should default to rgb scheme and switch all colours on on build light device when status is unknown': function () {
    this.mockConsole.expects('log').once().withExactArgs('Setting build light colour to %s for status %s', 'on', 'SOMEUNKNOWNSTATUS');
    this.mockFs.expects('writeFileSync').once().withExactArgs('/some/usbled/path/red', 1);
    this.mockFs.expects('writeFileSync').once().withExactArgs('/some/usbled/path/green', 1);
    this.mockFs.expects('writeFileSync').once().withExactArgs('/some/usbled/path/blue', 1);
    var nestor = new NestorBuildLight({ usbled: '/some/usbled/path/', platform: 'linux' });
    nestor.notify('SOMEUNKNOWNSTATUS');
  },
  'should blink red colour when status is fail and blinkOnFailure is true': function () {
    this.mockConsole.expects('log').once().withExactArgs('Setting build light colour to %s for status %s', 'red', 'fail');
    this.stub(BuildLight.prototype, 'blink', function (colour, cb) {
      cb();
    });
    var nestor = new NestorBuildLight({ scheme: ['red', 'green', 'blue'], usbled: '/some/usbled/path/', platform: 'linux', blinkOnFailure: true });
    nestor.notify('fail');
  },
  'should log error message when an error occurs while blinking failure colour': function () {
    this.mockConsole.expects('log').once().withExactArgs('Setting build light colour to %s for status %s', 'red', 'fail');
    this.mockConsole.expects('error').once().withExactArgs('some error');
    this.stub(BuildLight.prototype, 'blink', function (colour, cb) {
      cb(new Error('some error'));
    });
    var nestor = new NestorBuildLight({ scheme: ['red', 'green', 'blue'], usbled: '/some/usbled/path/', platform: 'linux', blinkOnFailure: true });
    nestor.notify('fail');
  }
});
