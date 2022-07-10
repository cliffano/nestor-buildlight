"use strict"
/* eslint no-unused-vars: 0 */
import bag from 'bagofcli';
import _cli from 'bagofcli';
import cli from '../lib/cli.js';
import BuildLight from 'buildlight';
import fs from 'fs';
import Jenkins from 'nestor';
import NestorBuildLight from '../lib/nestorbuildlight.js';
import referee from '@sinonjs/referee';
import sinon from 'sinon';
const assert = referee.assert;

describe('cli - exec', function () {
  it('should contain commands with actions', function(done) {
    const mockCommand = function (base, actions) {
      assert.isString(base);
      assert.isFunction(actions.commands.run.action);
      done();
    };
    this.bagCommandStub = sinon.stub(bag, 'command').value(mockCommand);
    cli.exec();
  });
});

describe('cli - run', function () {
  beforeEach(function () {
    this.mockConsole = sinon.mock(console);
    this.mockFs = sinon.mock(fs);
    this.mockProcess = sinon.mock(process);
    this.buildLightDriverStub = sinon.stub(BuildLight.prototype, '_driver').value(function (opts) {
      return;
    });
  });
  afterEach(function () {
    sinon.verify();
    sinon.restore();
  });
  it('should notify buildlight when there is no monitoring error', function(done) {
    const self = this;
    self.bagCommandStub = sinon.stub(bag, 'command').value(function (base, actions) {
      actions.commands.run.action({ job: 'somejob', schedule: '* * * * * *', scheme: 'red,green,blue', map: 'fail=red,ok=green,warn=blue', usbled: '/some/usbled/path', blinkOnfailure: true });
    });
    self.jenkinsMonitorStub = sinon.stub(Jenkins.prototype, 'monitor').value(function (opts, cb) {
      assert.equals(opts.job, 'somejob');
      assert.isUndefined(opts.view);
      assert.equals(opts.schedule, '* * * * * *');
      cb(null, 'ok');
    });
    self.nestorBuildLightNotifyStub = sinon.stub(NestorBuildLight.prototype, 'notify').value(function (result) {
      assert.equals(result, 'ok');
      self.bagCommandStub.restore();
      self.jenkinsMonitorStub.restore();
      self.nestorBuildLightNotifyStub.restore();
      done();
    });
    cli.exec();
  });
  it('should monitor using default settings', function(done) {
    const self = this;
    self.bagCommandStub = sinon.stub(bag, 'command').value(function (base, actions) {
      actions.commands.run.action({});
    });
    self.jenkinsMonitorStub = sinon.stub(Jenkins.prototype, 'monitor').value(function (opts, cb) {
      assert.isUndefined(opts.job);
      assert.isUndefined(opts.view);
      assert.isUndefined(opts.schedule);
      cb(null, 'ok');
    });
    self.nestorBuildLightNotifyStub = sinon.stub(NestorBuildLight.prototype, 'notify').value(function (result) {
      assert.equals(result, 'ok');
      self.bagCommandStub.restore();
      self.jenkinsMonitorStub.restore();
      self.nestorBuildLightNotifyStub.restore();
      done();
    });
    cli.exec();
  });
  it('should log error message and exit with non-zero code', function () {
    const self = this;
    this.mockConsole.expects('error').once().withExactArgs('some error');
    this.mockProcess.expects('exit').once().withExactArgs(1);
    self.bagCommandStub = sinon.stub(bag, 'command').value(function (base, actions) {
      actions.commands.run.action({});
    });
    self.jenkinsMonitorStub = sinon.stub(Jenkins.prototype, 'monitor').value(function (opts, cb) {
      assert.isUndefined(opts.job);
      assert.isUndefined(opts.view);
      assert.isUndefined(opts.schedule);
      self.bagCommandStub.restore();
      self.jenkinsMonitorStub.restore();
      cb(new Error('some error'));
    });
    cli.exec();
  });
});
