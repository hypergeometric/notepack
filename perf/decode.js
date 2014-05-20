var msgpack = require('../');
var msgpackJs = require('msgpack-js');
var msgpackNode = require('msgpack');
var data = require('./data');

var Benchtable = require('benchtable');

console.log('Decoding (this will take a while):');

var suite = new Benchtable;

suite
.addFunction('@coinative/msgpack', function (m, js, node, json) {
  msgpack.decode(m);
})
.addFunction('msgpack-js', function (m, js, node, json) {
  msgpackJs.decode(js);
})
.addFunction('msgpack-node', function (m, js, node, json) {
  msgpackNode.unpack(node);
})
// Note: JSON encodes buffers as arrays
.addFunction('JSON.parse (from Buffer)', function (m, js, node, json) {
  JSON.parse(json.toString());
})

.addInput('tiny', [msgpack.encode(data.tiny), msgpackJs.encode(data.tiny), msgpackNode.pack(data.tiny), new Buffer(JSON.stringify(data.tiny))])
.addInput('small', [msgpack.encode(data.small), msgpackJs.encode(data.small), msgpackNode.pack(data.small), new Buffer(JSON.stringify(data.small))])
.addInput('medium', [msgpack.encode(data.medium), msgpackJs.encode(data.medium), msgpackNode.pack(data.medium), new Buffer(JSON.stringify(data.medium))])
.addInput('large', [msgpack.encode(data.large), msgpackJs.encode(data.large), msgpackNode.pack(data.large), new Buffer(JSON.stringify(data.large))])

.on('complete', function () {
  console.log(this.table.toString());
})
.run({ async: true });
