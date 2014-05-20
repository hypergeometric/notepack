var msgpack = require('../');
var msgpackJs = require('msgpack-js');
var msgpackNode = require('msgpack');
var data = require('./data');

var Benchtable = require('benchtable');

console.log('Decoding:');

var suite = new Benchtable;

suite
.addFunction('@coinative/msgpack', function (a, b, c) {
  msgpack.decode(a);
})
.addFunction('msgpack-node', function (a, b, c) {
  msgpackNode.unpack(b);
})
.addFunction('msgpack-js', function (a, b, c) {
  msgpackJs.decode(c);
})

.addInput('small', [msgpack.encode(data.small), msgpackNode.pack(data.small), msgpackJs.encode(data.small)])
.addInput('medium', [msgpack.encode(data.medium), msgpackNode.pack(data.medium), msgpackJs.encode(data.medium)])
.addInput('large', [msgpack.encode(data.large), msgpackNode.pack(data.large), msgpackJs.encode(data.large)])

.on('complete', function () {
  console.log(this.table.toString());
})
.run({ async: true });
