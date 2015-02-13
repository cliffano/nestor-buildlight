var BuildLight = require('buildlight');

/**
 * class NestorBuildLight
 *
 * @param {String} opts: optional
 * - map: status-colour map, defaults to { OK: 'green', FAIL: 'red', WARN: 'blue' }
 * - scheme: color scheme array, defaults to [ 'red', 'green', 'blue' ]
 *           scheme allows flexibility to use BuildLight with various Delcom devices (RGB, RGY)
 * - usbled: path to usbled installation, if not specified then it will try to
 *           find a usbled installation at /sys/bus/usb/drivers/usbled/
 * - platform: override platform, used by unit tests to override buildlight platform
 * - blinkOnFailure: if true then build light will display blinking red, otherwise display red without blinking 
 */
function NestorBuildLight(opts) {
  this.opts        = opts;
  this.opts.scheme = this.opts.scheme || ['red', 'green', 'blue'];

  const MAP = {
    ok  : 'green',
    fail: 'red',
    warn: this.opts.scheme.indexOf('blue') !== -1 ? 'blue' : 'yellow'
  };
  this.opts.map    = this.opts.map || MAP;
  this.buildLight  = new BuildLight(this.opts);
}

/**
 * Notify build status as a colour on Delcom USB Visual Indocator build light.
 * Device color schemes contain red and green, which are used for OK and FAIL statuses.
 * While blue or yellow is used to represent a WARN.
 * Unknown/other status will be represented as all colors switched on.
 *
 * @param {String} status: build status
 */
NestorBuildLight.prototype.notify = function (status) {
  const UNKNOWN = 'on';

  var colour = this.opts.map[status] || UNKNOWN;
  var self   = this;

  function _colourise() {
    console.log('Setting build light colour to %s for status %s', colour, status);
    if (self.opts.blinkOnFailure && status === 'fail') {
      self.buildLight.blink(colour, function (err) {
        if (err) {
          console.error(err.message);
        }
      });
    } else {
      self.buildLight[colour]();
    }
  }

  this.buildLight.unblink(_colourise);
};

module.exports = NestorBuildLight;
