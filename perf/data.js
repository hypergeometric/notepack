function repeat (str, times) {
  return new Array(times + 1).join(str);
}

String.prototype.repeat = function (times) {
  return repeat(this, times);
};

function array(length) {
  var arr = new Array(length);
  for (var i = 0; i < arr.length; i++) {
    arr[i] = i;
  }
  return arr;
}

function map(length) {
  var result = {};
  for (var i = 0; i < length; i++) {
    result[i + ''] = i;
  }
  return result;
}

var small = {
  foo: 1,
  bar: [1, 2, 3, 4, 'abc', 'def'],
  foobar: {
    foo: true,
    bar: -2147483649
  }
};

var medium = {
  unsigned: [1, 2, 3, 4, { b: { c: [128, 256, 65536, 4294967296] } }],
  signed: [-1, -2, -3, -4, { b: { c: [-33, -129, -32769, -2147483649] } }],
  str: ['abc', 'g'.repeat(32), 'h'.repeat(256)],
  array: [[], array(16)],
  map: {},
  nil: null,
  bool: { 'true': true, 'false': false, both: [true, false, false, false, true] },
  'undefined': [undefined, true, false, null, undefined]
};
for (var i = 0; i < 32; i++) {
  medium.map['a'.repeat(i)] = 'a'.repeat(i);
  medium.map['b'.repeat(i)] = new Buffer('b'.repeat(i));
}

var large = {
  unsigned: [1, 2, 3, 4, { b: { c: [128, 256, 65536, 4294967296] } }],
  signed: [-1, -2, -3, -4, { b: { c: [-33, -129, -32769, -2147483649] } }],
  bin: [new Buffer('abc'), new Buffer('a'.repeat(256)), new Buffer('a'.repeat(65535))],
  str: ['abc', 'g'.repeat(32), 'h'.repeat(256), 'g'.repeat(65535)],
  array: [[], array(16), array(256)],
  map: {},
  nil: null,
  bool: { 'true': true, 'false': false, both: [true, false, false, false, true] },
  'undefined': [undefined, true, false, null, undefined]
};
for (var i = 0; i < 1024; i++) {
  large.map['a'.repeat(i)] = 'a'.repeat(i);
  large.map['b'.repeat(i)] = new Buffer('b'.repeat(i));
}

exports.small = small;
exports.medium = medium;
exports.large = large;
