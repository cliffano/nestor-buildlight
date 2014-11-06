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
      actions.commands.run.action({ job: 'somejob', schedule: '* * * * * *', scheme: 'red,green,blue', map: 'FAIL=red,OK=green,WARN=blue', usbled: '/some/usbled/path', blinkOnFailure: true });
    });
    this.stub(Jenkins.prototype, 'monitor', function (opts, cb) {
      assert.equals(opts.jobName, 'somejob');
      assert.equals(opts.viewName, undefined);
      assert.equals(opts.schedule, '* * * * * *');
      cb(null, 'OK');
    });
    this.stub(NestorBuildLight.prototype, 'notify', function (result) {
      assert.equals(result, 'OK');
      done();
    });
    cli.exec();
  },
  'should monitor using default settings': function (done) {
    this.stub(bag, 'command', function (base, actions) {
      actions.commands.run.action({});
    });
    this.stub(Jenkins.prototype, 'monitor', function (opts, cb) {
      assert.equals(opts.jobName, undefined);
      assert.equals(opts.viewName, undefined);
      assert.equals(opts.schedule, undefined);
      cb(null, 'OK');
    });
    this.stub(NestorBuildLight.prototype, 'notify', function (result) {
      assert.equals(result, 'OK');
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
      assert.equals(opts.jobName, undefined);
      assert.equals(opts.viewName, undefined);
      assert.equals(opts.schedule, undefined);
      cb(new Error('some error'));
    });
    cli.exec();
  }
});
