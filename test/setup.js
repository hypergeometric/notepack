var chai = require('chai');

// Chai chokes when diffing very large arrays
chai.config.showDiff = false;

global.expect = chai.expect;

function repeat (str, times) {
  return new Array(times + 1).join(str);
}
global.repeat = repeat;

String.prototype.repeat = function (times) {
  return repeat(this, times);
};
