var bag              = require('bagofcli');
var Jenkins          = require('nestor');
var NestorBuildLight = require('./nestorbuildlight');

function _run(args) {

  var buildLightOpts = {
    scheme        : args.scheme ? args.scheme.split(',') : undefined,
    usbled        : args.usbled,
    blinkOnFailure: args.blinkOnFailure
  };

  var jenkinsOpts = {
    jobName : args.job,
    viewName: args.view,
    schedule: args.schedule
  };

  var jenkins = new Jenkins(process.env.JENKINS_URL);
  jenkins.monitor(jenkinsOpts, function (err, result) {
    if (err) {
      console.error(err.message);
      process.exit(1);
    } else {
      var nestorBuildLight = new NestorBuildLight(buildLightOpts);
      nestorBuildLight.notify(result);
    }
  });
}

/**
 * Execute Nestor BuildLight CLI.
 */
function exec() {

  var actions = {
    commands: {
      run: { action: _run }
    }
  };

  bag.command(__dirname, actions);
}

exports.exec = exec;
