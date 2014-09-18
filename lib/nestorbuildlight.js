var BuildLight = require('buildlight');

/**
 * class NestorBuildLight
 *
 * @param {String} opts: optional
 * - scheme: color scheme array, defaults to [ 'red', 'green', 'blue' ]
 *           scheme allows flexibility to use BuildLight with various Delcom devices (RGB, RGY)
 * - usbled: path to usbled installation, if not specified then it will try to
 *           find a usbled installation at /sys/bus/usb/drivers/usbled/
 * - platform: override platform, used by unit tests to override buildlight platform
 * - blinkOnFailure: if true then build light will display blinking red, otherwise display red without blinking 
 */
function NestorBuildLight(opts) {
  this.opts       = opts || {};
  this.buildLight = new BuildLight(this.opts);
}

/**
 * Notify build status as a colour on Delcom USB Visual Indocator build light.
 *
 * @param {String} status: build status
 */
NestorBuildLight.prototype.notify = function (status) {
  const COLOURS = {
    OK  : 'green',
    FAIL: 'red',
    WARN: 'on' // all colours switched on is closer to yellow
  };
  const UNKNOWN = 'blue';

  var colour = COLOURS[status];
  var self   = this;

  function _colourise() {
    if (self.opts.blinkOnFailure && status === 'FAIL') {
      self.buildLight.blink(colour, function (err) {
        if (err) {
          console.error(err.message);
        }
      });
    } else {
      self.buildLight[colour || UNKNOWN]();
    }
  }

  this.buildLight.unblink(_colourise);
};

module.exports = NestorBuildLight;
