var BuildLight       = require('buildlight');
var buster           = require('buster-node');
var fs               = require('fs');
var NestorBuildLight = require('../lib/nestorbuildlight');
var referee          = require('referee');
var assert           = referee.assert;

buster.testCase('jenkins - jenkins', {
  setUp: function () {
    this.stub(BuildLight.prototype, '_driver', function (opts) {
      return;
    });
  },
  'should set opts to default when there is no customisation': function () {
    var nestor = new NestorBuildLight({});
    assert.equals(nestor.opts.scheme, ['red', 'green', 'blue']);
    assert.equals(nestor.opts.map, { OK: 'green', FAIL: 'red', WARN: 'blue' });
    assert.defined(nestor.buildLight);
  },
  'should default WARN colour map to yellow when blue colour is not part of the scheme': function () {
    var nestor = new NestorBuildLight({ scheme: ['red', 'green', 'yellow'] });
    assert.equals(nestor.opts.scheme, ['red', 'green', 'yellow']);
    assert.equals(nestor.opts.map, { OK: 'green', FAIL: 'red', WARN: 'yellow' });
    assert.defined(nestor.buildLight);
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
    this.mockFs.expects('writeFileSync').once().withExactArgs('/some/usbled/path/red', 0);
    this.mockFs.expects('writeFileSync').once().withExactArgs('/some/usbled/path/green', 0);
    this.mockFs.expects('writeFileSync').once().withExactArgs('/some/usbled/path/blue', 0);
    this.mockFs.expects('writeFileSync').once().withExactArgs('/some/usbled/path/green', 1);
    var nestor = new NestorBuildLight({ scheme: ['red', 'green', 'blue'], usbled: '/some/usbled/path/', platform: 'linux' });
    nestor.notify('OK');
  },
  'should switch all colours off then switch blue colour on on build light device when notification status is warn': function () {
    this.mockFs.expects('writeFileSync').once().withExactArgs('/some/usbled/path/red', 0);
    this.mockFs.expects('writeFileSync').once().withExactArgs('/some/usbled/path/green', 0);
    this.mockFs.expects('writeFileSync').once().withExactArgs('/some/usbled/path/blue', 0);
    this.mockFs.expects('writeFileSync').once().withExactArgs('/some/usbled/path/blue', 1);
    var nestor = new NestorBuildLight({ scheme: ['red', 'green', 'blue'], usbled: '/some/usbled/path/', platform: 'linux' });
    nestor.notify('WARN');
  },
  'should switch all colours off then switch yellow colour on on build light device when notification status is warn': function () {
    this.mockFs.expects('writeFileSync').once().withExactArgs('/some/usbled/path/red', 0);
    this.mockFs.expects('writeFileSync').once().withExactArgs('/some/usbled/path/green', 0);
    this.mockFs.expects('writeFileSync').once().withExactArgs('/some/usbled/path/yellow', 0);
    this.mockFs.expects('writeFileSync').once().withExactArgs('/some/usbled/path/yellow', 1);
    var nestor = new NestorBuildLight({ scheme: ['red', 'green', 'yellow'], usbled: '/some/usbled/path/', platform: 'linux' });
    nestor.notify('WARN');
  },
  'should switch all colours on on build light device when status is unknown': function () {
    this.mockFs.expects('writeFileSync').once().withExactArgs('/some/usbled/path/red', 1);
    this.mockFs.expects('writeFileSync').once().withExactArgs('/some/usbled/path/green', 1);
    this.mockFs.expects('writeFileSync').once().withExactArgs('/some/usbled/path/blue', 1);
    var nestor = new NestorBuildLight({ scheme: ['red', 'green', 'blue'], usbled: '/some/usbled/path/', platform: 'linux' });
    nestor.notify('SOMEUNKNOWNSTATUS');
  },
  'should switch all colours off then switch red colour on on build light device when status is fail': function () {
    this.mockFs.expects('writeFileSync').once().withExactArgs('/some/usbled/path/red', 0);
    this.mockFs.expects('writeFileSync').once().withExactArgs('/some/usbled/path/green', 0);
    this.mockFs.expects('writeFileSync').once().withExactArgs('/some/usbled/path/blue', 0);
    this.mockFs.expects('writeFileSync').once().withExactArgs('/some/usbled/path/red', 1);
    var nestor = new NestorBuildLight({ scheme: ['red', 'green', 'blue'], usbled: '/some/usbled/path/', platform: 'linux' });
    nestor.notify('FAIL');
  },
  'should default to rgb scheme and switch all colours on on build light device when status is unknown': function () {
    this.mockFs.expects('writeFileSync').once().withExactArgs('/some/usbled/path/red', 1);
    this.mockFs.expects('writeFileSync').once().withExactArgs('/some/usbled/path/green', 1);
    this.mockFs.expects('writeFileSync').once().withExactArgs('/some/usbled/path/blue', 1);
    var nestor = new NestorBuildLight({ usbled: '/some/usbled/path/', platform: 'linux' });
    nestor.notify('SOMEUNKNOWNSTATUS');
  },
  'should blink red colour when status is fail and blinkOnFailure is true': function () {
    this.stub(BuildLight.prototype, 'blink', function (colour, cb) {
      cb();
    });
    var nestor = new NestorBuildLight({ scheme: ['red', 'green', 'blue'], usbled: '/some/usbled/path/', platform: 'linux', blinkOnFailure: true });
    nestor.notify('FAIL');
  },
  'should log error message when an error occurs while blinking failure colour': function () {
    this.mockConsole.expects('error').once().withExactArgs('some error');
    this.stub(BuildLight.prototype, 'blink', function (colour, cb) {
      cb(new Error('some error'));
    });
    var nestor = new NestorBuildLight({ scheme: ['red', 'green', 'blue'], usbled: '/some/usbled/path/', platform: 'linux', blinkOnFailure: true });
    nestor.notify('FAIL');
  }
});
