"use strict"
import bag from 'bagofcli';
import Jenkins from 'nestor';
import p from 'path';
import querystring from 'querystring';
import NestorBuildLight from './nestorbuildlight.js';

const DIRNAME = p.dirname(import.meta.url).replace('file://', '');

function _run(args) {

  const buildLightOpts = {
    scheme        : args.scheme ? args.scheme.split(',') : undefined,
    map           : args.map ? querystring.parse(args.map, ',', '=') : undefined,
    usbled        : args.usbled,
    blinkOnFailure: args.blinkOnFailure
  };

  const jenkinsOpts = {
    job     : args.job,
    view    : args.view,
    schedule: args.schedule
  };

  const jenkins = new Jenkins(process.env.JENKINS_URL);
  jenkins.monitor(jenkinsOpts, function (err, result) {
    if (err) {
      console.error(err.message);
      process.exit(1);
    } else {
      const nestorBuildLight = new NestorBuildLight(buildLightOpts);
      nestorBuildLight.notify(result);
    }
  });
}

/**
 * Execute Nestor BuildLight CLI.
 */
function exec() {

  const actions = {
    commands: {
      run: { action: _run }
    }
  };

  bag.command(DIRNAME, actions);
}

const exports = {
  exec: exec
};

export {
  exports as default
};