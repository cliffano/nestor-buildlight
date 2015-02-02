var bag              = require('bagofcli');
var BuildLight       = require('buildlight');
var buster           = require('buster-node');
var cli              = require('../lib/cli');
var Jenkins          = require('nestor');
var NestorBuildLight = require('../lib/nestorbuildlight');
var referee          = require('referee');
var assert           = referee.assert;

buster.testCase('cli - exec', {
  'should contain commands with actions': function (done) {
    var mockCommand = function (base, actions) {
      assert.defined(base);
      assert.defined(actions.commands.run.action);
      done();
    };
    this.mock({});
    this.stub(bag, 'command', mockCommand);
    cli.exec();
  }
});

buster.testCase('cli - run', {
  setUp: function () {
    this.mockConsole = this.mock(console);
    this.mockProcess = this.mock(process);
    this.stub(BuildLight.prototype, '_driver', function () {});
  },
  'should notify buildlight when there is no monitoring error': function (done) {
    this.stub(bag, 'command', function (base, actions) {
      actions.commands.run.action({ job: 'somejob', schedule: '* * * * * *', scheme: 'red,green,blue', map: 'fail=red,ok=green,warn=blue', usbled: '/some/usbled/path', blinkOnfailure: true });
    });
    this.stub(Jenkins.prototype, 'monitor', function (opts, cb) {
      assert.equals(opts.job, 'somejob');
      assert.equals(opts.view, undefined);
      assert.equals(opts.schedule, '* * * * * *');
      cb(null, 'ok');
    });
    this.stub(NestorBuildLight.prototype, 'notify', function (result) {
      assert.equals(result, 'ok');
      done();
    });
    cli.exec();
  },
  'should monitor using default settings': function (done) {
    this.stub(bag, 'command', function (base, actions) {
      actions.commands.run.action({});
    });
    this.stub(Jenkins.prototype, 'monitor', function (opts, cb) {
      assert.equals(opts.job, undefined);
      assert.equals(opts.view, undefined);
      assert.equals(opts.schedule, undefined);
      cb(null, 'ok');
    });
    this.stub(NestorBuildLight.prototype, 'notify', function (result) {
      assert.equals(result, 'ok');
      done();
    });
    cli.exec();
  },
  'should log error message and exit with non-zero code': function () {
    this.mockConsole.expects('error').once().withExactArgs('some error');
    this.mockProcess.expects('exit').once().withExactArgs(1);
    this.stub(bag, 'command', function (base, actions) {
      actions.commands.run.action({});
    });
    this.stub(Jenkins.prototype, 'monitor', function (opts, cb) {
      assert.equals(opts.job, undefined);
      assert.equals(opts.view, undefined);
      assert.equals(opts.schedule, undefined);
      cb(new Error('some error'));
    });
    cli.exec();
  }
});
