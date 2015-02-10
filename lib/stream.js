'use strict';

var stream = require('stream');
var Decoder = require('./decode').Decoder;

function createStream () {
  var cache = new Buffer('');

  var ret = stream.Writable();
  ret._write = function (chunk, encoding, next) {
    cache = Buffer.concat([cache, chunk]);
    
    try {
      while (true) {
        var d = new Decoder(cache);
        ret.emit('data', d.parse());
        cache = cache.slice(d.offset);
        if (!cache.length) {
          break;
        }
      }
    } catch (e) {
    }
    next();
  };
  return ret;
}

module.exports = createStream;
